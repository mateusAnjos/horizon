package br.com.horizon.horizon.controller;

import br.com.horizon.horizon.model.Reserva;
import br.com.horizon.horizon.model.dto.CategoriaCarroDTO;
import br.com.horizon.horizon.model.dto.ReservaDTO;
import br.com.horizon.horizon.model.dto.ReservaPorCarroDTO;
import br.com.horizon.horizon.service.ReservaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/reserva")
public class ReservaController {
    @Autowired
    ReservaService reservaService;

    @GetMapping
    @ResponseBody
    public ResponseEntity<List<ReservaDTO>> buscarTodos() {
        List<ReservaDTO> reservaDTOList = reservaService.buscarTodos();
        return ResponseEntity.ok(reservaDTOList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReservaDTO> buscarPorId(@PathVariable Long id){
        ReservaDTO reservaDTO = reservaService.buscarPorId(id);
        return ResponseEntity.ok(reservaDTO);
    }

    @GetMapping("/carro/{id}")
    public ResponseEntity<List<ReservaPorCarroDTO>> buscarCarroPorId(@PathVariable Long id){
        List<ReservaPorCarroDTO> reservaPorCarroDTO = reservaService.buscarPorIdCaro(id);
        return ResponseEntity.ok(reservaPorCarroDTO);
    }

    @GetMapping("/usuario/{email}")
    public ResponseEntity<List<ReservaDTO>> buscarUsuarioPorId(@PathVariable String email){
        List<ReservaDTO> reservaPorCarroDTO = reservaService.buscarPorUsuario(email);
        return ResponseEntity.ok(reservaPorCarroDTO);
    }

    @PostMapping
    public ResponseEntity<ReservaDTO> salvar(@RequestBody ReservaDTO reservaDTO){
        reservaDTO = reservaService.salvar(reservaDTO);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}")
                .buildAndExpand(reservaDTO.getId()).toUri();
        return ResponseEntity.created(uri).body(reservaDTO);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReservaDTO> atualizacaoComAlteracaoCompleta(@PathVariable Long id, @RequestBody ReservaDTO reservaDTO){
         reservaDTO = reservaService.alteracaoTotal(id, reservaDTO);
        return ResponseEntity.ok(reservaDTO);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id){
        reservaService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
