package br.com.horizon.horizon.service;

import br.com.horizon.horizon.model.*;
import br.com.horizon.horizon.model.dto.CaracteristicasDTO;
import br.com.horizon.horizon.model.dto.CarroDTO;
import br.com.horizon.horizon.repository.CaracteristicaRepository;
import br.com.horizon.horizon.repository.CarroRepository;
import br.com.horizon.horizon.service.exceptions.DataBaseException;
import br.com.horizon.horizon.service.exceptions.ResourceNotFoundException;
import br.com.horizon.horizon.utils.ObjectConverterHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityNotFoundException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class CarroService {
    @Autowired
    CarroRepository carroRepository;

    @Autowired
    CaracteristicaRepository caracteristicasRepository;


    @Transactional(readOnly = true)
    public List<CarroDTO> buscarTodos() {
        List<Carro> carroList = carroRepository.findAllByAtivoTrue();
        return ObjectConverterHandler.converterLista(carroList, CarroDTO.class);
    }


    @Transactional
    public CarroDTO salvar(CarroDTO carroDTO) {
        Carro carro = ObjectConverterHandler.converterObjeto(carroDTO, Carro.class);
        Set<Caracteristicas> caracteristicasSet = new HashSet<>();
        for (Caracteristicas caracteristicas : carro.getCaracteristica()) {
            caracteristicasRepository.findById(caracteristicas.getId()).ifPresent(caracteristicasSet::add);
        }

        carro.setCaracteristica(new HashSet<>());
        for (Caracteristicas caracteristicas : caracteristicasSet) {
            carro.getCaracteristica().add(caracteristicas);
            caracteristicas.getCarro().add(carro);
        }

        List<ImagensCarro> imagensCarroList = carroDTO.getImagensCarro();
        for (ImagensCarro imagemCarro : imagensCarroList) {
            imagemCarro.setCarro(carro);
        }
        carro.setImagensCarro(imagensCarroList);

        carro = carroRepository.save(carro);
        return ObjectConverterHandler.converterObjeto(carro, CarroDTO.class);
    }


    @Transactional(readOnly = true)
    public CarroDTO buscarPorId(Long id) {
        Optional<Carro> carroOptional = carroRepository.findById(id);
        Carro carro = carroOptional.orElseThrow(() -> new ResourceNotFoundException("carro com id " + id));
        return ObjectConverterHandler.converterObjeto(carro, CarroDTO.class);
    }

    @Transactional(readOnly = true)
    public CarroDTO buscarPorNome(String nome){
        Optional<Carro> carroOptional = carroRepository.findByModelo(nome);
        Carro carro = carroOptional.orElseThrow(() -> new ResourceNotFoundException("carro com nome " + nome));
        return ObjectConverterHandler.converterObjeto(carro, CarroDTO.class);
    }

    @Transactional(readOnly = true)
    public List<CarroDTO> buscarPorNomeCidade(String cidade) {
        Optional<List<Carro>> carroOptional = carroRepository.findByCidade(cidade);
        List<Carro> carros = carroOptional.orElseThrow(() -> new ResourceNotFoundException("Carros com a cidade " + cidade));
        if (carros.size() == 0) {
            throw new ResourceNotFoundException("Carros com a cidade " + cidade);
        }
        return ObjectConverterHandler.converterLista(carros, CarroDTO.class);
    }

    @Transactional(readOnly = true)
    public List<CarroDTO> buscarPorReserva(LocalDate dataEntrega, LocalDate dataRetirada, String nomeCidade) {

        String dataEntregaString = String.valueOf(dataEntrega);
        String dataRetiradaString = String.valueOf(dataRetirada);
        System.out.println(dataEntregaString);
        System.out.println(dataRetiradaString);
        Optional<List<Carro>> carroOptional = carroRepository.findByReserva(dataEntregaString, dataRetiradaString, nomeCidade);
        System.out.println(dataEntrega);
        System.out.println(dataRetirada);
        List<Carro> carros = carroOptional.orElseThrow(() -> new ResourceNotFoundException("Carros com a cidade "));
//        if (carros.size() == 0) {
//            throw new ResourceNotFoundException("Carros com a reserv " + cidade);
//        }
        return ObjectConverterHandler.converterLista(carros, CarroDTO.class);
    }

    @Transactional
    public void deletar(Long id) {
        try {
            var carro = carroRepository.getReferenceById(id);
            carro.excluir();
        } catch (EmptyResultDataAccessException e) {
            throw new ResourceNotFoundException("categoria com id " + id);
        } catch (DataIntegrityViolationException e) {
            throw new DataBaseException("Violação de integridade.");
        }
    }

    @Transactional
    public CarroDTO alteracaoTotal(Long id, CarroDTO carroDTO) {
        try {
            Carro carro = carroRepository.getReferenceById(id);
            carro.setCor(carroDTO.getCor());
            carro.setDescricao(carroDTO.getDescricao());
            carro.setChassi(carroDTO.getChassi());
            carro.setMarca(carroDTO.getMarca());
            carro.setCidade(carroDTO.getCidade());
            carro.setImagensCarro(carroDTO.getImagensCarro());
            carro.setCategoria(ObjectConverterHandler.converterObjeto(carroDTO.getCategoria(), Categoria.class));
            carro.setModelo(carroDTO.getModelo());
            carro.setPlaca(carroDTO.getPlaca());
            carro.setRenavam(carroDTO.getRenavam());
            carro.setReserva(carroDTO.getReserva());
            carro.setValorDiario(carroDTO.getValorDiario());

            // Remoção das características não presentes no carroDTO
            Set<Caracteristicas> caracteristicasRemover = new HashSet<>();
            for (Caracteristicas caracteristicas : carro.getCaracteristica()) {
                if (!carroDTO.getCaracteristica().contains(caracteristicas)) {
                    caracteristicas.getCarro().remove(carro);
                    caracteristicasRemover.add(caracteristicas);
                }
            }
            carro.getCaracteristica().removeAll(caracteristicasRemover);

            // Adição das novas características do carroDTO
            Set<Caracteristicas> caracteristicasSet = new HashSet<>();
            for (Caracteristicas caracteristicasDTO : carroDTO.getCaracteristica()) {
                Caracteristicas caracteristicas = caracteristicasRepository.findById(caracteristicasDTO.getId())
                        .orElseThrow(() -> new ResourceNotFoundException("Característica não encontrada com o ID: " + caracteristicasDTO.getId()));
                caracteristicasSet.add(caracteristicas);
                caracteristicas.getCarro().add(carro);
            }
            carro.setCaracteristica(caracteristicasSet);

            carro = carroRepository.save(carro);
            return ObjectConverterHandler.converterObjeto(carro, CarroDTO.class);
        } catch (EntityNotFoundException e) {
            throw new ResourceNotFoundException("Carro com ID " + id + " não encontrado");
        }
    }
}
