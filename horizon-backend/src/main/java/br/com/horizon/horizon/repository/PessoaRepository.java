package br.com.horizon.horizon.repository;

import br.com.horizon.horizon.model.Pessoa;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PessoaRepository extends JpaRepository<Pessoa, Long> {
}
