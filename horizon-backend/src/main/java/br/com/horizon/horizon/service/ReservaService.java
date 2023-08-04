package br.com.horizon.horizon.service;

import br.com.horizon.horizon.model.Carro;
import br.com.horizon.horizon.model.Reserva;
import br.com.horizon.horizon.model.Usuario;
import br.com.horizon.horizon.model.dto.CarroDTO;
import br.com.horizon.horizon.model.dto.ReservaDTO;
import br.com.horizon.horizon.model.dto.ReservaPorCarroDTO;
import br.com.horizon.horizon.repository.CarroRepository;
import br.com.horizon.horizon.repository.ReservaRepository;
import br.com.horizon.horizon.repository.UsuarioRepository;
import br.com.horizon.horizon.service.exceptions.DataBaseException;
import br.com.horizon.horizon.service.exceptions.ResourceNotFoundException;
import br.com.horizon.horizon.utils.ObjectConverterHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class ReservaService {
    @Autowired
    ReservaRepository reservaRepository;

    @Autowired
    CarroRepository carroRepository;

    @Autowired
    UsuarioRepository usuarioRepository;

    
    @Transactional
    public ReservaDTO salvar(ReservaDTO reservaDTO) {
        Reserva reserva = ObjectConverterHandler.converterObjeto(reservaDTO, Reserva.class);
        Optional<Usuario> usuario = usuarioRepository.findByUsername(reserva.getUsuario().getUsername());
        Set<Carro> carrosSelecionados = new HashSet<>();
        for (Carro carro : reserva.getCarro()) {
            carroRepository.findById(carro.getId()).ifPresent(carrosSelecionados::add);
        }

        reserva.setCarro(new HashSet<>());
        for (Carro carro : carrosSelecionados) {
            carro.getReserva().add(reserva);
            reserva.getCarro().add(carro);
        }

        reserva.setUsuario(usuario.get());

        reserva = reservaRepository.save(reserva);
        return ObjectConverterHandler.converterObjeto(reserva, ReservaDTO.class);
    }

    
    @Transactional(readOnly = true)
    public ReservaDTO buscarPorId(Long id) {
        Optional<Reserva> reservaOptional = reservaRepository.findById(id);
        Reserva reserva = reservaOptional.orElseThrow(() -> new ResourceNotFoundException("reserva com id "+ id));
        return ObjectConverterHandler.converterObjeto(reserva, ReservaDTO.class);
    }


    @Transactional
    public void deletar(Long id) {
        try{
           var reserva = reservaRepository.getReferenceById(id);
           reserva.excluir();
        }catch (EmptyResultDataAccessException e){
            throw new ResourceNotFoundException("reserva com id "+ id);
        }catch (DataIntegrityViolationException e){
            throw new DataBaseException("Violação de integridade.");
        }

    }

    
    public ReservaDTO alteracaoTotal(Long id, ReservaDTO reservaDTO) {
        return null;
    }

    @Transactional(readOnly = true)
    public List<ReservaPorCarroDTO> buscarPorIdCaro(Long id){
       Optional<List<Reserva>> reservaOptional = reservaRepository.reservaPorCarro(id);
       List<Reserva> reserva = reservaOptional.orElseThrow(() -> new ResourceNotFoundException("reserva com id" + id));


        return ObjectConverterHandler.converterLista(reserva, ReservaPorCarroDTO.class);
    }

    @Transactional(readOnly = true)
    public List<ReservaDTO> buscarPorUsuario(String email){
        Optional<List<Reserva>> reservaOptional = reservaRepository.reservaPorUsuario(email);
        List<Reserva> reserva = reservaOptional.orElseThrow(() -> new ResourceNotFoundException("reserva com email" + email));


        return ObjectConverterHandler.converterLista(reserva, ReservaDTO.class);
    }



    
//    evita bloquear o banco de dados em operações de leitura, onde não seria necessário haver esse tipo de bloqueio
    @Transactional(readOnly = true)
    public List<ReservaDTO> buscarTodos() {
        List<Reserva> reservaList = reservaRepository.findAll();
        return ObjectConverterHandler.converterLista(reservaList, ReservaDTO.class);
    }
}
