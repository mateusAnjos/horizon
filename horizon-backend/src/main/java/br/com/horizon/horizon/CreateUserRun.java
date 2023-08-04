package br.com.horizon.horizon;

import br.com.horizon.horizon.model.*;
import br.com.horizon.horizon.repository.PessoaRepository;
import br.com.horizon.horizon.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.ArrayList;
import java.util.List;

@Configuration
@Profile("dev")
public class CreateUserRun implements ApplicationRunner {
    BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    @Autowired
    UsuarioRepository repository;

    @Autowired
    PessoaRepository pessoaRepository;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        PessoaFisica pessoaFisica = new PessoaFisica("660.983.915-80");
        PessoaJuridica pessoaJuridica = new PessoaJuridica("81.258.380/0001-60");

//        pessoaRepository.saveAll(List.of(pessoaFisica, pessoaJuridica));
        List<Funcao> funcaos = new ArrayList<>();
        List<Usuario> usuarios = new ArrayList<>();
        Funcao funcao = new Funcao(1L, "admin");
        funcaos.add(funcao);
        Usuario usuario = new Usuario();
        usuario.setPassword(encoder.encode("12345"));
        usuario.setPessoa(pessoaFisica);
        usuario.setUsername("admin@admin.com");
        usuario.setAuthorities(funcaos);
        usuarios.add(usuario);
        List<Funcao> funcaos2 = new ArrayList<>();
        Funcao funcao1 = new Funcao(2L, "cliente");
        Usuario usuario1 = new Usuario();
        usuario1.setPassword(encoder.encode("12345"));
//        usuario1.setCpf("12155444454");
        usuario1.setUsername("cliente@cliente.com");

        usuario1.setAuthorities(funcaos2);
        usuario1.setPessoa(pessoaJuridica);
        usuarios.add(usuario1);

        repository.saveAll(usuarios);

    }
}
