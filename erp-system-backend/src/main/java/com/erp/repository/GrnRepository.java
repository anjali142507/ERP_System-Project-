package com.erp.repository;

import com.erp.entity.Grn;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface GrnRepository extends JpaRepository<Grn, Long> {

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM grn_items WHERE grn_id = :grnId", nativeQuery = true)
    void deleteItemsByGrnId(@Param("grnId") Long grnId);
}