output "horizon_frontend_public_ip" {
    description = "The public IP address of the frontend web server"
    value = aws_eip.horizon_frontend_eip[0].public_ip
    depends_on = [aws_eip.horizon_frontend_eip]
}

output "horizon_frontend_public_dns" {
    description = "The public DNS address fo the frontend web server"
    value = aws_eip.horizon_frontend_eip[0].public_dns
    depends_on = [aws_eip.horizon_frontend_eip]
}

output "horizon_backend_public_ip" {
    description = "The public IP address of the backend web server"
    value = aws_eip.horizon_backend_eip[0].public_ip
    depends_on = [aws_eip.horizon_backend_eip]
}

output "horizon_backend_public_dns" {
    description = "The public DNS address fo the backend web server"
    value = aws_eip.horizon_backend_eip[0].public_dns
    depends_on = [aws_eip.horizon_backend_eip]
}

output "database_endpoint" {
    description = "The endpoint of the database"
    value = aws_db_instance.horizon_database.address
}

output "database_port" {
    description = "The port of the database"
    value = aws_db_instance.horizon_database.port
}

output "bucket_id" {
    description = "S3 bucket id"
    value = aws_s3_bucket.horizon_bucket.id
}