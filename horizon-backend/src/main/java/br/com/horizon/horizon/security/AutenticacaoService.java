package br.com.horizon.horizon.security;

import br.com.horizon.horizon.model.Usuario;
import br.com.horizon.horizon.repository.UsuarioRepository;
import br.com.horizon.horizon.service.exceptions.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AutenticacaoService implements UserDetailsService {

    @Autowired
    UsuarioRepository usuarioRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<Usuario> usuario = usuarioRepository.findByUsername(username);
        if(usuario.isEmpty()){
            throw new ResourceNotFoundException("usuario com username " + username);
        }
        return usuario.get();
    }
}
