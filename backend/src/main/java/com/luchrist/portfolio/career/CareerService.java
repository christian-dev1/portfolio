package com.luchrist.portfolio.career;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CareerService {

    private final CareerEntryRepository entries;

    public CareerService(CareerEntryRepository entries) {
        this.entries = entries;
    }

    @Transactional(readOnly = true)
    public List<CareerEntryResponse> findVisibleEntries() {
        return entries.findByVisibleTrueOrderByPositionAsc().stream()
                .map(CareerEntryResponse::from)
                .toList();
    }
}
