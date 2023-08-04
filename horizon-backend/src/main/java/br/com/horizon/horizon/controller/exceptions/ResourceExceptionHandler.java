package br.com.horizon.horizon.controller.exceptions;


import br.com.horizon.horizon.service.exceptions.DataBaseException;
import br.com.horizon.horizon.service.exceptions.ResourceNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import javax.servlet.http.HttpServletRequest;
import javax.validation.ConstraintViolationException;
import java.sql.SQLIntegrityConstraintViolationException;
import java.time.Instant;
import java.util.NoSuchElementException;


// anotação que permite que essa classe intercepte exceções na camada de resource/controller
@ControllerAdvice
public class ResourceExceptionHandler {

    // essa anotação é usada para o controllerAdvice saber que exceção ele deve observar, então caso aconteça essa exceção em alguma requisição ele irá intervir
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<StandardError> entityNotFound(ResourceNotFoundException e, HttpServletRequest request){
        StandardError err = new StandardError();
        err.setTimeStamp(Instant.now());
        err.setStatus(HttpStatus.NOT_FOUND.value());
        err.setError("Resource not found.");
        err.setMessage(e.getMessage());
        err.setPath(request.getRequestURI());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(err);
    }
    @ExceptionHandler(DataBaseException.class)
    public ResponseEntity<StandardError> dataBase(DataBaseException e, HttpServletRequest request){
        StandardError err = new StandardError();
        err.setTimeStamp(Instant.now());
        err.setStatus(HttpStatus.BAD_REQUEST.value());
        err.setError("Database exception.");
        err.setMessage(e.getMessage());
        err.setPath(request.getRequestURI());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(err);
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<StandardError> argument(MethodArgumentTypeMismatchException e, HttpServletRequest request){
        StandardError err = new StandardError();
        err.setTimeStamp(Instant.now());
        err.setStatus(HttpStatus.BAD_REQUEST.value());
        err.setError(e.getMessage());
        err.setMessage("O endpoint esperava um tipo de dado diferente.");
        err.setPath(request.getRequestURI());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(err);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<StandardError> argumentInvalid(ConstraintViolationException e, HttpServletRequest request){
        String errorMessage = e.getConstraintViolations().iterator().next().getMessage();
        StandardError err = new StandardError();
        err.setTimeStamp(Instant.now());
        err.setStatus(HttpStatus.BAD_REQUEST.value());
        err.setError(errorMessage);
        err.setMessage("O servidor esperava uma formatação de dados diferente.");
        err.setPath(request.getRequestURI());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(err);
    }

    @ExceptionHandler(SQLIntegrityConstraintViolationException.class)
    public ResponseEntity<StandardError> integrityViolation(SQLIntegrityConstraintViolationException e, HttpServletRequest request){
        StandardError err = new StandardError();
        err.setTimeStamp(Instant.now());
        err.setStatus(HttpStatus.BAD_REQUEST.value());
        if(e.getMessage().contains("Duplicate")){
            err.setError("Usuário com esse e-mail já existe.");
        }else if (e.getMessage().contains("null")){
            String campoNulo = e.getMessage().split("'")[1];
            err.setError("Campo essencial " + campoNulo+ " está nulo");
        }

        err.setMessage(e.getMessage());
        err.setPath(request.getRequestURI());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(err);
    }
    @ExceptionHandler(NoSuchElementException.class)
    public ResponseEntity<StandardError> suchElement(NoSuchElementException e, HttpServletRequest request){
        StandardError err = new StandardError();
        err.setTimeStamp(Instant.now());
        err.setStatus(HttpStatus.BAD_REQUEST.value());
        err.setError(e.getMessage());
        err.setMessage("campo essencial está nulo");
        err.setPath(request.getRequestURI());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(err);
    }

}
