package br.com.horizon.horizon;

import br.com.horizon.horizon.service.S3Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class HorizonApplication{

	public static void main(String[] args) {
		SpringApplication.run(HorizonApplication.class, args);
	}

}
