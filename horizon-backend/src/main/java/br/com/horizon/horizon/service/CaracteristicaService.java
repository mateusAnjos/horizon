package br.com.horizon.horizon.service;

import br.com.horizon.horizon.model.Caracteristicas;
import br.com.horizon.horizon.model.dto.CaracteristicasDTO;
import br.com.horizon.horizon.repository.CaracteristicaRepository;
import br.com.horizon.horizon.utils.ObjectConverterHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CaracteristicaService {

    @Autowired
    CaracteristicaRepository caracteristicaRepository;


    public List<CaracteristicasDTO> buscarTodas(){
        List<Caracteristicas> caracteristicas = caracteristicaRepository.findAll();

        return ObjectConverterHandler.converterLista(caracteristicas, CaracteristicasDTO.class);
    }



}
