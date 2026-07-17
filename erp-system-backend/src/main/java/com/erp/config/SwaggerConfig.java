package com.erp.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .addServersItem(new Server()
                        .url("https://erpsystem-project-production.up.railway.app"))
                .info(new Info()
                        .title("ERP System API")
                        .version("1.0")
                        .description("API for Inventory and Sales Management ERP"));
    }
}