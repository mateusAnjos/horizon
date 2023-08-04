package br.com.horizon.horizon.controller;

import br.com.horizon.horizon.model.dto.UsuarioDTO;
import br.com.horizon.horizon.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;
@CrossOrigin(origins = "*", methods = {RequestMethod.POST, RequestMethod.GET, RequestMethod.PUT, RequestMethod.DELETE}, allowedHeaders = "*")
@RestController
@RequestMapping("/usuario")
public class UsuarioController {

    @Autowired
    UsuarioService usuarioService;

    @GetMapping
    @ResponseBody
    public ResponseEntity<List<UsuarioDTO>> buscarTodos() {
        List<UsuarioDTO> usuarioDTOList = usuarioService.buscarTodos();
        return ResponseEntity.ok(usuarioDTOList);
    }

    @GetMapping("/{username}")
    public ResponseEntity<UsuarioDTO> buscarPorUsername(@PathVariable String username){
        UsuarioDTO usuarioDTO = usuarioService.buscarPorId(username);
        return ResponseEntity.ok(usuarioDTO);
    }


    @PostMapping
    public ResponseEntity<UsuarioDTO> salvar(@RequestBody UsuarioDTO bodyUserDTO){
        UsuarioDTO usuarioDTO = usuarioService.salvar(bodyUserDTO);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}")
                .buildAndExpand(usuarioDTO.getId()).toUri();
        return ResponseEntity.created(uri).body(usuarioDTO);
    }
}
