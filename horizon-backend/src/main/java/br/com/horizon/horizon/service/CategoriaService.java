package br.com.horizon.horizon.service;

import br.com.horizon.horizon.model.Carro;
import br.com.horizon.horizon.model.Categoria;
import br.com.horizon.horizon.model.ImagensCategoria;
import br.com.horizon.horizon.model.dto.CarroSemCategoriaDTO;
import br.com.horizon.horizon.model.dto.CategoriaCarroDTO;
import br.com.horizon.horizon.model.dto.CategoriaDTO;
import br.com.horizon.horizon.model.dto.CategoriaIdDTO;
import br.com.horizon.horizon.repository.CategoriaRepository;
import br.com.horizon.horizon.service.exceptions.DataBaseException;
import br.com.horizon.horizon.service.exceptions.ResourceNotFoundException;
import br.com.horizon.horizon.utils.ObjectConverterHandler;
import br.com.horizon.horizon.utils.config.AppConfig;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityNotFoundException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CategoriaService{

    @Autowired
    CategoriaRepository categoriaRepository;

    @Autowired
    ImagensCategoriaService imagensCategoriaService;



    @Transactional
    public CategoriaDTO salvar(CategoriaDTO categoriaDTO) {
        Categoria categoria = ObjectConverterHandler.converterObjeto(categoriaDTO, Categoria.class);
        List<ImagensCategoria> imagensCategoriaList = categoriaDTO.getImagensCategoria();
        for (ImagensCategoria imagemCategoria : imagensCategoriaList) {
            imagemCategoria.setCategoria(categoria);
        }
        categoria.setImagensCategoria(imagensCategoriaList);
        categoria = categoriaRepository.save(categoria);
        return ObjectConverterHandler.converterObjeto(categoria, CategoriaDTO.class);
    }


    @Transactional(readOnly = true)
    public CategoriaDTO buscarPorId(Long id) {
        Optional<Categoria> categoriaOptional = categoriaRepository.findById(id);

        Categoria categoria = categoriaOptional.orElseThrow(() -> new ResourceNotFoundException("categoria com id "+ id));
        categoria.setQntCarros(categoria.getCarros().size());
        CategoriaDTO categoriaDTO = new CategoriaDTO(categoria);
        return categoriaDTO;
    }


    //    evita bloquear o banco de dados em operações de leitura, onde não seria necessário haver esse tipo de bloqueio
    @Transactional(readOnly = true)
    public List<CategoriaDTO> buscarTodos() {
        List<Categoria> categoriaList = categoriaRepository.findAll();
        List<CategoriaDTO> categoriaDTO = new ArrayList<>();
        for(Categoria cat: categoriaList){
            cat.setQntCarros(cat.getCarros().size());
            categoriaDTO.add(new CategoriaDTO(cat));
        }

        System.out.println(categoriaList);
        return categoriaDTO;
    }

    @Transactional
    public CategoriaCarroDTO buscarPorCategoria(String descricao){
        Optional<Categoria> categoriaOptional = categoriaRepository.findByNome(descricao);
        Categoria categoria = categoriaOptional.orElseThrow(() -> new ResourceNotFoundException("categoria com o nome " + descricao));
        return ObjectConverterHandler.converterObjeto(categoria, CategoriaCarroDTO.class);
    }




    public void deletar(Long id) {
        try{
            categoriaRepository.deleteById(id);
        }catch (EmptyResultDataAccessException e){
            throw new ResourceNotFoundException("categoria com id "+ id);
        }catch (DataIntegrityViolationException e){
            throw new DataBaseException("Violação de integridade.");
        }
    }


    @Transactional
    public CategoriaDTO alteracaoTotal(Long id, CategoriaDTO categoriaDTO) {
        try{
            Categoria categoria = categoriaRepository.getReferenceById(id);
            categoria.setNome(categoriaDTO.getNome());
            categoria.setDescricao(categoriaDTO.getDescricao());
            categoria = categoriaRepository.save(categoria);
            return ObjectConverterHandler.converterObjeto(categoria, CategoriaDTO.class);
        }catch (EntityNotFoundException e){
            throw new ResourceNotFoundException("categoria com id "+ id);
        }
    }

}
