package br.com.horizon.horizon.controller;

import br.com.horizon.horizon.model.dto.CidadeDTO;
import br.com.horizon.horizon.model.dto.ImagensCategoriaDTO;
import br.com.horizon.horizon.service.CidadeService;
import br.com.horizon.horizon.service.ImagensCategoriaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/img-categoria")
public class ImagensCategoriaController {

    @Autowired
    ImagensCategoriaService imagensCategoriaService;

    @GetMapping
    @ResponseBody
    public ResponseEntity<List<ImagensCategoriaDTO>> buscarTodos() {
        List<ImagensCategoriaDTO> cidadeDTOList = imagensCategoriaService.buscarTodos();
        return ResponseEntity.ok(cidadeDTOList);
    }

//    @PostMapping
//    public ResponseEntity<ImagensCategoriaDTO> salvar(@RequestBody ImagensCategoriaDTO imagensCategoriaDTO){
//        imagensCategoriaDTO = imagensCategoriaService.salvar(imagensCategoriaDTO);
//        URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}")
//                .buildAndExpand(imagensCategoriaDTO.getId()).toUri();
//        return ResponseEntity.created(uri).body(imagensCategoriaDTO);
//    }
}
