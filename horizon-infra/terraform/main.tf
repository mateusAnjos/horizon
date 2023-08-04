terraform {
    required_providers {
        aws = {
            source = "hashicorp/aws"
            version = "5.0.0"
        }
    }
}

provider "aws" {
    region = var.aws_region
}

data "aws_availability_zones" "available" {
    state = "available"
}

resource "aws_vpc" "horizon_vpc" {
    cidr_block = var.vpc_cidr_block
    enable_dns_hostnames = true
    tags = {
        Name = "horizon_vpc"
    }
}

resource "aws_internet_gateway" "horizon_igw" {
    vpc_id = aws_vpc.horizon_vpc.id
    tags = {
        Name = "horizon_igw"
    }
}

resource "aws_subnet" "horizon_public_subnet" {
    count = var.subnet_count.public
    vpc_id = aws_vpc.horizon_vpc.id
    cidr_block = var.public_subnet_cidr_blocks[count.index]
    availability_zone = data.aws_availability_zones.available.names[count.index]
    tags = {
        Name = "horizon_public_subnet_${count.index}"
    }
}

resource "aws_subnet" "horizon_private_subnet" {
    count = var.subnet_count.private
    vpc_id = aws_vpc.horizon_vpc.id
    cidr_block = var.private_subnet_cidr_blocks[count.index]
    availability_zone = data.aws_availability_zones.available.names[count.index]
    tags = {
        Name = "horizon_private_subnet_${count.index}"
    }
}

resource "aws_route_table" "horizon_public_rt" {
    vpc_id = aws_vpc.horizon_vpc.id
    route {
        cidr_block = "0.0.0.0/0"
        gateway_id = aws_internet_gateway.horizon_igw.id
    }
}

resource "aws_route_table_association" "public" {
    count = var.subnet_count.public
    route_table_id = aws_route_table.horizon_public_rt.id
    subnet_id = aws_subnet.horizon_public_subnet[count.index].id
}

resource "aws_route_table" "horizon_private_rt" {
    vpc_id = aws_vpc.horizon_vpc.id
}

resource "aws_route_table_association" "private" {
    count = var.subnet_count.private
    route_table_id = aws_route_table.horizon_private_rt.id
    subnet_id = aws_subnet.horizon_private_subnet[count.index].id
}

resource "aws_security_group" "horizon_web_sg" {
    name = "horizon_web_sg"
    description = "Security group for Horizon web servers"
    vpc_id = aws_vpc.horizon_vpc.id

    ingress {
        description = "Allow all traffic through HTTP"
        from_port = 80
        to_port = 80
        protocol = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
        ipv6_cidr_blocks = ["::/0"]
    }

    ingress {
        description = "Allow all traffic through HTTPS"
        from_port = 443
        to_port = 443
        protocol = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
        ipv6_cidr_blocks = ["::/0"]
    }

    ingress {
        description = "API REST Spring"
        from_port = 8080
        to_port = 8080
        protocol = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
        ipv6_cidr_blocks = ["::/0"]
    }

    ingress {
        description = "SSH"
        from_port = 22
        to_port = 22
        protocol = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
        ipv6_cidr_blocks = ["::/0"]
    }

    egress {
        description = "Allow all outbound traffic"
        from_port = 0
        to_port = 0
        protocol = "-1"
        cidr_blocks = ["0.0.0.0/0"]
        ipv6_cidr_blocks = ["::/0"]
    }

    tags = {
      Name = "horizon_web_sg"
    }
}

resource "aws_security_group" "horizon_db_sg" {
    name = "horizon_db_sg"
    description = "Security group for Horizon databases"
    vpc_id = aws_vpc.horizon_vpc.id

    ingress {
        description = "Allow MySQL traffic from only the web sg"
        from_port = 3306
        to_port = 3306
        protocol = "tcp"
        security_groups = [aws_security_group.horizon_web_sg.id]
        cidr_blocks = ["0.0.0.0/0"]
        ipv6_cidr_blocks = ["::/0"]
    }

    tags = {
        Name = "horizon_db_sg"
    }
}

resource "aws_db_subnet_group" "horizon_db_subnet_group" {
    name = "horizon_db_subnet_group"
    description = "DB subnet group for Horizon"
    subnet_ids = [for subnet in aws_subnet.horizon_private_subnet : subnet.id]
}

# RDS INSTANCE

resource "aws_db_instance" "horizon_database" {
    allocated_storage = var.settings.database.allocated_storage
    engine = var.settings.database.engine
    engine_version = var.settings.database.engine_version
    instance_class = var.settings.database.instance_class
    db_name = var.settings.database.db_name
    identifier = var.settings.database.db_identifier
    username = var.db_username
    password = var.db_password
    db_subnet_group_name = aws_db_subnet_group.horizon_db_subnet_group.id
    vpc_security_group_ids = [aws_security_group.horizon_db_sg.id]
    skip_final_snapshot = var.settings.database.skip_final_snapshot
}

# EC2 INSTANCES

resource "aws_key_pair" "horizon_kp" {
    key_name = "horizon_kp"
    public_key = file("horizon_kp.pub")
}

data "aws_ami" "ubuntu" {
    most_recent = "true"
    filter {
        name = "name"
        values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
    }

    filter {
        name = "virtualization-type"
        values = ["hvm"]
    }

    owners = ["099720109477"]
}

resource "aws_instance" "horizon_frontend" {
    count = var.settings.web_app.count
    ami = data.aws_ami.ubuntu.id
    instance_type = var.settings.web_app.instance_type
    subnet_id = aws_subnet.horizon_public_subnet[count.index].id
    key_name = aws_key_pair.horizon_kp.key_name
    vpc_security_group_ids = [aws_security_group.horizon_web_sg.id]

    root_block_device {
        volume_size = 30
    }

    tags = {
        Name = "horizon_frontend"
    }
}

resource "aws_eip" "horizon_frontend_eip" {
    count = var.settings.web_app.count
    instance = aws_instance.horizon_frontend[count.index].id
    domain = "vpc"
    tags = {
        Name = "horizon_frontend_eip"
    }
}

resource "aws_instance" "horizon_backend" {
    count = var.settings.web_app.count
    ami = data.aws_ami.ubuntu.id
    instance_type = var.settings.web_app.instance_type
    subnet_id = aws_subnet.horizon_public_subnet[count.index].id
    key_name = aws_key_pair.horizon_kp.key_name
    vpc_security_group_ids = [aws_security_group.horizon_web_sg.id]

    root_block_device {
        volume_size = 30
    }

    tags = {
        Name = "horizon_backend"
    }
}

resource "aws_eip" "horizon_backend_eip" {
    count = var.settings.web_app.count
    instance = aws_instance.horizon_backend[count.index].id
    domain = "vpc"
    tags = {
        Name = "horizon_backend_eip"
    }
}

# S3 BUCKETS

resource "aws_s3_bucket" "horizon_bucket" {
    bucket = "dh-g6-horizon-bucket"
    
    tags = {
        Name= "Horizon bucket"
  }
}

resource "aws_s3_bucket_ownership_controls" "horizon_bucket_oc" {
    bucket = aws_s3_bucket.horizon_bucket.id

    rule {
        object_ownership = "BucketOwnerPreferred"
    }
}

resource "aws_s3_bucket_public_access_block" "horizon_bucket_pab" {
    bucket = aws_s3_bucket.horizon_bucket.id

    block_public_acls       = false
    block_public_policy     = false
    ignore_public_acls      = false
    restrict_public_buckets = false
}

resource "aws_s3_bucket_cors_configuration" "horizon_bucket_cors_conf" {
    bucket = aws_s3_bucket.horizon_bucket.id

    cors_rule {
        allowed_headers = ["*"]
        allowed_methods = ["GET", "HEAD"]
        allowed_origins = ["*"]
        expose_headers = []
        max_age_seconds = 3000
    }
}

resource "aws_s3_bucket_acl" "horizon_bucket_acl" {
    depends_on = [ 
        aws_s3_bucket_ownership_controls.horizon_bucket_oc,
        aws_s3_bucket_public_access_block.horizon_bucket_pab,
    ]

    bucket = aws_s3_bucket.horizon_bucket.id
    acl    = "public-read"
}

resource "aws_s3_bucket_policy" "horizon_bucket_policy" {
    bucket = aws_s3_bucket.horizon_bucket.id
    policy = data.aws_iam_policy_document.allow_public_access.json
}

data "aws_iam_policy_document" "allow_public_access" {
    statement {
        sid = "PublicReadGetObject"
        effect = "Allow"
        principals {
            type        = "*"
            identifiers = ["*"]
        }

        actions = [
            "s3:GetObject"
        ]

        resources = [
            "${aws_s3_bucket.horizon_bucket.arn}/*",
        ]
    }
}