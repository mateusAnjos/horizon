package br.com.horizon.horizon.repository;

import br.com.horizon.horizon.model.Caracteristicas;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CaracteristicaRepository extends JpaRepository<Caracteristicas, Long> {
}
