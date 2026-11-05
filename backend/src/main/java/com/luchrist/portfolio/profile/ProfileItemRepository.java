package com.luchrist.portfolio.profile;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ProfileItemRepository extends JpaRepository<ProfileItem, Long> {

    List<ProfileItem> findByKindOrderByPositionAsc(String kind);
}
