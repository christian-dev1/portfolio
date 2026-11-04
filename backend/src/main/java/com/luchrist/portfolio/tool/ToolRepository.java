package com.luchrist.portfolio.tool;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ToolRepository extends JpaRepository<Tool, Long> {

    List<Tool> findByVisibleTrueOrderByIdAsc();
}
