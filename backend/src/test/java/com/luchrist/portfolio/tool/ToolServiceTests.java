package com.luchrist.portfolio.tool;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;

import com.luchrist.portfolio.TestcontainersConfiguration;
import com.luchrist.portfolio.common.LocalizedText;

@SpringBootTest
@Import(TestcontainersConfiguration.class)
class ToolServiceTests {

    @Autowired
    private ToolService toolService;

    private ToolResponse tool(List<ToolResponse> tools, String id) {
        return tools.stream().filter(t -> t.id().equals(id)).findFirst().orElseThrow();
    }

    @Test
    void returnsAllVisibleToolsIncludingAi() {
        List<ToolResponse> tools = toolService.findVisibleTools();

        assertThat(tools).hasSize(22);
        assertThat(tools).extracting(ToolResponse::category).contains("ai");
    }

    @Test
    void computesUsedInFromProjectLinks() {
        ToolResponse docker = tool(toolService.findVisibleTools(), "docker");

        assertThat(docker.usedIn()).extracting(LocalizedText::fr)
                .containsExactly("WIMO", "Vesty Shop", "Sekouh", "SuperApp");
    }

    @Test
    void appendsTheUsageNote() {
        ToolResponse git = tool(toolService.findVisibleTools(), "git");

        assertThat(git.usedIn()).extracting(LocalizedText::fr)
                .containsExactly("Usage quotidien");
    }
}
