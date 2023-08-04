package br.com.horizon.horizon.repository;

import br.com.horizon.horizon.model.Carro;
import br.com.horizon.horizon.model.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.sql.Timestamp;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface CarroRepository extends JpaRepository<Carro, Long> {


    @Query("SELECT car FROM Carro car WHERE car.cidade.nome = :nomeCidade and car.ativo = 1")
    Optional<List<Carro>> findByCidade(@Param("nomeCidade") String nomeCidade);

    Optional<Carro> findByModelo(String nome);



@Query(nativeQuery = true, value = "SELECT * FROM carro c WHERE c.id  NOT IN (SELECT cr.carro_id FROM carro_reserva cr JOIN reserva r ON cr.reserva_id = r.id WHERE (:dataEntrega >= r.retirada) AND (:dataRetirada <= r.entrega)) AND c.cidade_id IN (SELECT id from cidade city WHERE city.nome LIKE %:nomeCidade%) AND c.ativo = 1 ORDER BY c.id;")
    Optional<List<Carro>> findByReserva(@Param("dataEntrega") String dataEntrega, @Param("dataRetirada") String dataRetirada, @Param("nomeCidade") String nomeCidade);

    List<Carro> findAllByAtivoTrue();
}
