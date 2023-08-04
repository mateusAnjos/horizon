package br.com.horizon.horizon.repository;

import br.com.horizon.horizon.model.ImagensCategoria;
import br.com.horizon.horizon.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByUsername(String username);

}
