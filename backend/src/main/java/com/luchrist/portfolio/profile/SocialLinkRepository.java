package com.luchrist.portfolio.profile;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface SocialLinkRepository extends JpaRepository<SocialLink, Long> {

    List<SocialLink> findAllByOrderByPositionAsc();
}
