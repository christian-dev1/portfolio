package com.luchrist.portfolio.profile;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ProfileValueRepository extends JpaRepository<ProfileValue, Long> {

    List<ProfileValue> findAllByOrderByPositionAsc();
}
