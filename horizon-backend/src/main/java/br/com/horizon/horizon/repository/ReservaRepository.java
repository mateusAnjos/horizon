package br.com.horizon.horizon.repository;

import br.com.horizon.horizon.model.Reserva;
import br.com.horizon.horizon.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Long> {

    @Query(nativeQuery = true, value = "SELECT * FROM reserva r JOIN carro_reserva cr on r.id = cr.reserva_id where cr.carro_id = :carroID and r.ativo = 1")
    Optional<List<Reserva>> reservaPorCarro(@Param("carroID") Long carroID);

    @Query(nativeQuery = true, value = "SELECT * FROM reserva r JOIN user usr on r.usuario_id = usr.id where usr.username = :usuarioEmail")
    Optional<List<Reserva>> reservaPorUsuario(@Param("usuarioEmail") String usuarioEmail);

}
