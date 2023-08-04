package br.com.horizon.horizon.service;

import br.com.horizon.horizon.model.Categoria;
import br.com.horizon.horizon.model.Cidade;
import br.com.horizon.horizon.model.dto.CategoriaDTO;
import br.com.horizon.horizon.model.dto.CidadeDTO;
import br.com.horizon.horizon.repository.CidadeRepository;
import br.com.horizon.horizon.utils.ObjectConverterHandler;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class CidadeService{

    @Autowired
    CidadeRepository cidadeRepository;

    
    @Transactional
    public CidadeDTO salvar(CidadeDTO cidadeDTO) {
        Cidade cidade = ObjectConverterHandler.converterObjeto(cidadeDTO, Cidade.class);
        cidade = cidadeRepository.save(cidade);
        return ObjectConverterHandler.converterObjeto(cidade, CidadeDTO.class);
    }

    
    public CidadeDTO buscarPorId(Long id) {
        return null;
    }

    
    public void deletar(Long id) {

    }

    
    public CidadeDTO alteracaoTotal(Long id, CidadeDTO cidadeDTO) {
        return null;
    }

    
    @Transactional(readOnly = true)
    public List<CidadeDTO> buscarTodos() {
        List<Cidade> cidadeList = cidadeRepository.findAll();
        return ObjectConverterHandler.converterLista(cidadeList, CidadeDTO.class);
    }
}
