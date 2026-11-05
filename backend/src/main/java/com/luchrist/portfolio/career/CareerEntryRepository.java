package com.luchrist.portfolio.career;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CareerEntryRepository extends JpaRepository<CareerEntry, Long> {

    List<CareerEntry> findByVisibleTrueOrderByPositionAsc();
}
