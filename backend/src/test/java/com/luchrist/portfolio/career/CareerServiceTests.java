package com.luchrist.portfolio.career;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;

import com.luchrist.portfolio.TestcontainersConfiguration;

@SpringBootTest
@Import(TestcontainersConfiguration.class)
class CareerServiceTests {

    @Autowired
    private CareerService careerService;

    @Test
    void returnsOnlyVisibleEntriesInOrder() {
        List<CareerEntryResponse> entries = careerService.findVisibleEntries();

        assertThat(entries).extracting(CareerEntryResponse::id)
                .containsExactly("kfokam48", "bac", "ice-cream-shop");
    }

    @Test
    void keepsOptionalFieldsEmptyForTheBaccalaureate() {
        CareerEntryResponse bac = careerService.findVisibleEntries().get(1);

        assertThat(bac.startYear()).isNull();
        assertThat(bac.description()).isNull();
        assertThat(bac.endYear()).isEqualTo((short) 2023);
    }
}
