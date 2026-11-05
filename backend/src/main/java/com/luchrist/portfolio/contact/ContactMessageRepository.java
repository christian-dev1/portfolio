package com.luchrist.portfolio.contact;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

public interface ContactMessageRepository extends JpaRepository<ContactMessage, Long> {
    @Query(value = "select pg_advisory_xact_lock(hashtextextended(:email, 0))", nativeQuery = true)
    void lockEmail(@Param("email") String email);

    List<ContactMessage> findByEmailAndCreatedAtAfterOrderByCreatedAtAsc(String email, OffsetDateTime since);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select m from ContactMessage m where m.id = :id")
    Optional<ContactMessage> findForDelivery(@Param("id") Long id);

    @Query("select m.id from ContactMessage m where m.sendAttempts < 5 and m.createdAt > :oldest "
            + "and (m.status = 'failed' or (m.status = 'received' and m.createdAt < :stale))")
    List<Long> findRetryCandidates(@Param("oldest") OffsetDateTime oldest, @Param("stale") OffsetDateTime stale);

    long deleteByCreatedAtBefore(OffsetDateTime cutoff);
}
