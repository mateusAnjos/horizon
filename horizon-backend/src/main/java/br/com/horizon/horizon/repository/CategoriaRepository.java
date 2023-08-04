package br.com.horizon.horizon.repository;

import br.com.horizon.horizon.model.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Long> {


    @Query(nativeQuery = true, value = "SELECT cat.nome, cat.id, cat.descricao, count(car.id) FROM Categoria cat JOIN carro car on cat.id = car.categoria_id GROUP BY cat.id")
    List<Categoria> findAllContarCarros();
    Optional<Categoria> findByNome(String descricao);


}
