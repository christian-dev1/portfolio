package com.luchrist.portfolio.profile;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface SpokenLanguageRepository extends JpaRepository<SpokenLanguage, Long> {

    List<SpokenLanguage> findAllByOrderByPositionAsc();
}
