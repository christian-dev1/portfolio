package com.luchrist.portfolio.career;

import java.util.List;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Career")
@RestController
@RequestMapping("/api/career")
public class CareerController {

    private final CareerService careerService;

    public CareerController(CareerService careerService) {
        this.careerService = careerService;
    }

    @Operation(summary = "List visible education and experience entries")
    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public List<CareerEntryResponse> listVisibleEntries() {
        return careerService.findVisibleEntries();
    }
}
