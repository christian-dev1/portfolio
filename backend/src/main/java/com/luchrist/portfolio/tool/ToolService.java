package com.luchrist.portfolio.tool;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ToolService {

    private final ToolRepository tools;

    public ToolService(ToolRepository tools) {
        this.tools = tools;
    }

    @Transactional(readOnly = true)
    public List<ToolResponse> findVisibleTools() {
        return tools.findByVisibleTrueOrderByIdAsc().stream()
                .map(ToolResponse::from)
                .toList();
    }
}
