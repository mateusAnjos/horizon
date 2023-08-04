package br.com.horizon.horizon.controller;

import br.com.horizon.horizon.model.dto.CaracteristicasDTO;
import br.com.horizon.horizon.service.CaracteristicaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/caracteristica")
public class CaracteristicaController {

    @Autowired
    CaracteristicaService caracteristicaService;

    @GetMapping
    public ResponseEntity<List<CaracteristicasDTO>> buscarTodos(){
       List<CaracteristicasDTO> caracteristicasDTO= caracteristicaService.buscarTodas();

       return ResponseEntity.ok(caracteristicasDTO);
    }
}
