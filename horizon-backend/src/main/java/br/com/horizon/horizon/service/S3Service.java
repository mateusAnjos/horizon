package br.com.horizon.horizon.service;

import com.amazonaws.AmazonClientException;
import com.amazonaws.AmazonServiceException;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.amazonaws.services.s3.model.PutObjectResult;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;




@Service
public class S3Service {

    private static Logger LOG =LoggerFactory.getLogger(S3Service.class);

    @Autowired
    private AmazonS3 s3client;

    @Value("${s3.bucket}")
    private String bucketName;

    public void uploadFile(MultipartFile file, String filename) {
        try {
            File fileObj = convertMultiPartFileToFile(file);
            //File file = new File(filee);
            LOG.info("Upload start");
            s3client.putObject(new PutObjectRequest(bucketName, filename, fileObj));
            LOG.info("Upload finish");
        }
        catch (AmazonServiceException e) {
            LOG.info("AmazonServiceException: " + e.getErrorMessage());
            LOG.info("Status code: " + e.getErrorCode());
        }
        catch (AmazonClientException e) {
            LOG.info("AmazonClientException: " +  e.getMessage());
        }
    }

    private File convertMultiPartFileToFile(MultipartFile file) {
        File convertedFile = new File(file.getOriginalFilename());
        try (FileOutputStream fos = new FileOutputStream(convertedFile)) {
            fos.write(file.getBytes());
        } catch (IOException e) {
            LOG.error("Error converting multipartFile to file", e);
        }
        return convertedFile;
    }
}
