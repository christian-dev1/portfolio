package com.luchrist.portfolio.profile;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface BioParagraphRepository extends JpaRepository<BioParagraph, Long> {

    List<BioParagraph> findAllByOrderByPositionAsc();
}
