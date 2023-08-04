package br.com.horizon.horizon.repository;

import br.com.horizon.horizon.model.Cidade;
import br.com.horizon.horizon.model.ImagensCategoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ImagensCategoriaRepository extends JpaRepository<ImagensCategoria, Long> {

}
