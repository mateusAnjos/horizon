package br.com.horizon.horizon.service;

import br.com.horizon.horizon.model.Usuario;
import br.com.horizon.horizon.model.dto.UsuarioDTO;
import br.com.horizon.horizon.repository.UsuarioRepository;
import br.com.horizon.horizon.service.exceptions.DataBaseException;
import br.com.horizon.horizon.service.exceptions.ResourceNotFoundException;
import br.com.horizon.horizon.utils.ObjectConverterHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityNotFoundException;
import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService{

    @Autowired
    UsuarioRepository usuarioRepository;

    @Autowired
    BCryptPasswordEncoder passwordEncoder;


    @Transactional
    public UsuarioDTO salvar(UsuarioDTO usuarioDTO) {
        System.out.println(usuarioDTO);
        usuarioDTO.setPassword(passwordEncoder.encode(usuarioDTO.getPassword()));
        Usuario usuario = ObjectConverterHandler.converterObjeto(usuarioDTO, Usuario.class);
        usuario = usuarioRepository.save(usuario);
        return ObjectConverterHandler.converterObjeto(usuario, UsuarioDTO.class);
    }

    @Transactional(readOnly = true)
    public UsuarioDTO buscarPorId(Long id) {
        Optional<Usuario> usuarioOptional = usuarioRepository.findById(id);
        Usuario usuario = usuarioOptional.orElseThrow(() -> {throw new ResourceNotFoundException("usuário com id");
        });
        return ObjectConverterHandler.converterObjeto(usuario, UsuarioDTO.class);
    }

    
    public void deletar(Long id) {
        try{
            usuarioRepository.deleteById(id);
        }catch (EmptyResultDataAccessException e){
            throw new ResourceNotFoundException("usuario com id "+ id);
        }catch (DataIntegrityViolationException e){
            throw new DataBaseException("Violação de integridade.");
        }

    }

    @Transactional
    public UsuarioDTO buscarPorId(String username){
        Usuario usuario = usuarioRepository.findByUsername(username).get();
        return ObjectConverterHandler.converterObjeto(usuario, UsuarioDTO.class);
    }

    @Transactional
    public UsuarioDTO alteracaoTotal(Long id, UsuarioDTO usuarioDTO) {
        try{
            Usuario usuario = usuarioRepository.getReferenceById(id);
            usuario.setUsername(usuarioDTO.getUsername());
//            usuario.setCpf(usuarioDTO.getCpf());

            usuario = usuarioRepository.save(usuario);
            return ObjectConverterHandler.converterObjeto(usuario, UsuarioDTO.class);
        }catch (EntityNotFoundException e){
            throw new ResourceNotFoundException("categoria com id "+ id);
        }
    }


    @Transactional(readOnly = true)
    public List<UsuarioDTO> buscarTodos() {
        List<Usuario> usuarioList = usuarioRepository.findAll();
        return ObjectConverterHandler.converterLista(usuarioList, UsuarioDTO.class);
    }
}
