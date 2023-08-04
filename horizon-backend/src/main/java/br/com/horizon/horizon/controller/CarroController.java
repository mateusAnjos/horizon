package br.com.horizon.horizon.controller;

import br.com.horizon.horizon.model.ImagensCarro;
import br.com.horizon.horizon.model.dto.CarroDTO;
import br.com.horizon.horizon.service.CarroService;
import br.com.horizon.horizon.service.S3Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.File;
import java.io.UnsupportedEncodingException;
import java.net.URI;
import java.net.URLDecoder;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/carro")
public class CarroController {

    @Autowired
    CarroService carroService;

    @Autowired
    S3Service s3Service;

    @GetMapping
    @ResponseBody
    public ResponseEntity<List<CarroDTO>> buscarTodos() {
        List<CarroDTO> carroDTOList = carroService.buscarTodos();
        return ResponseEntity.ok(carroDTOList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CarroDTO> buscarPorId(@PathVariable Long id){
        CarroDTO carroDTO = carroService.buscarPorId(id);
        return ResponseEntity.ok(carroDTO);
    }

    @GetMapping("/nome")
    public ResponseEntity<CarroDTO> buscarPorNome(@RequestParam("nome") String nome){
        CarroDTO carroDTO = carroService.buscarPorNome(nome);
        return ResponseEntity.ok(carroDTO);
    }

    @GetMapping("/cidade/{nome}")
    public ResponseEntity<List<CarroDTO>> buscarPorNomeCidade (@PathVariable String nome){
        List<CarroDTO> carroDTO = carroService.buscarPorNomeCidade(nome);
        return ResponseEntity.ok(carroDTO);
    }

    @GetMapping("/reserva")
    public ResponseEntity<List<CarroDTO>> buscarReservaPorData (@RequestParam("dataEntrega") @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate dataEntrega,
                                                                @RequestParam("dataRetirada") @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate dataRetirada,
                                                                @RequestParam("nomeCidade")  String nomeCidade
                                                                ){
        System.out.println(dataEntrega);
        System.out.println(dataRetirada);
        List<CarroDTO> carroDTO = carroService.buscarPorReserva(dataEntrega, dataRetirada, nomeCidade);
        return ResponseEntity.ok(carroDTO);
    }

    @PostMapping
    public ResponseEntity<CarroDTO> salvar(@RequestBody CarroDTO carroDTO){
        carroDTO = carroService.salvar(carroDTO);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}")
                .buildAndExpand(carroDTO.getId()).toUri();
        return ResponseEntity.created(uri).body(carroDTO);
    }



    @PostMapping("/enviarImagem")
    public ResponseEntity<List<String>> salvar(@RequestParam(value = "file") List<MultipartFile> files, @RequestParam(value = "nomes") List<String> nomes){
        List<String> urls = new ArrayList<>();

        for (int i = 0; i < files.size(); i++) {
            MultipartFile file = files.get(i);
            String nomeArquivo = nomes.get(i);
            s3Service.uploadFile(file, nomeArquivo);
            String url = "https://dh-g6-horizon-bucket.s3.sa-east-1.amazonaws.com/" + nomeArquivo;
            urls.add(url);
        }
        return ResponseEntity.ok().body(urls);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CarroDTO> alteracaoTotal(@PathVariable Long id, @RequestBody CarroDTO carroDTO){
        carroDTO = carroService.alteracaoTotal(id, carroDTO);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}")
                .buildAndExpand(carroDTO.getId()).toUri();
        return ResponseEntity.ok(carroDTO);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id){
        carroService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
