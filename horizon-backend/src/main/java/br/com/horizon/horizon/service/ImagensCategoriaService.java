package br.com.horizon.horizon.service;

import br.com.horizon.horizon.model.Cidade;
import br.com.horizon.horizon.model.ImagensCategoria;
import br.com.horizon.horizon.model.dto.CidadeDTO;
import br.com.horizon.horizon.model.dto.ImagensCategoriaDTO;
import br.com.horizon.horizon.repository.CidadeRepository;
import br.com.horizon.horizon.repository.ImagensCategoriaRepository;
import br.com.horizon.horizon.utils.ObjectConverterHandler;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class ImagensCategoriaService{

    @Autowired
    ImagensCategoriaRepository imagensCategoriaRepository;

    
    @Transactional
    public List<ImagensCategoria> salvar(List<ImagensCategoria> imagensCategoria) {
        imagensCategoria = imagensCategoriaRepository.saveAll(imagensCategoria);
        return imagensCategoria;
    }

    
    public ImagensCategoriaDTO buscarPorId(Long id) {
        return null;
    }

    
    public void deletar(Long id) {

    }

    
    public ImagensCategoriaDTO alteracaoTotal(Long id, ImagensCategoriaDTO cidadeDTO) {
        return null;
    }

    
    @Transactional(readOnly = true)
    public List<ImagensCategoriaDTO> buscarTodos() {
        List<ImagensCategoria> imagensCategoriaList = imagensCategoriaRepository.findAll();
        return ObjectConverterHandler.converterLista(imagensCategoriaList, ImagensCategoriaDTO.class);
    }
}
