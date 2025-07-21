        (function ($) {
    // 모델 (데이터 저장)
    var templateData = {
        template1: [],
        template2: [],
        template3: [],
    };

    // 뷰 (템플릿 표시)
    function renderTemplates(container, templateType) {
        container.empty();
        templateData[templateType].forEach(function (template, index) {
            var templateHtml = '<div class="template">' + template + '<button class="custom-button" data-index="' + index + '">Custom Event</button></div>';
            container.append(templateHtml);
        });
    }

    // 컨트롤러 (동작 관리)
    $.fn.mvcPlugin = function () {
        // 클릭 이벤트 핸들러
        $(this).on("click", function () {
            var templateType = $(this).parent().find(".template-container").attr("class").split(" ")[1];
            var newTemplate = prompt("Enter a new template for " + templateType + ":");
            if (newTemplate) {
                templateData[templateType].push(newTemplate);
                renderTemplates($(this).parent().find(".template-container"), templateType);
            }
        });

        // 커스텀 버튼 클릭 이벤트 핸들러
        $(document).on("click", ".custom-button", function () {
            var index = $(this).data("index");
            var templateType = $(this).closest(".template-container").attr("class").split(" ")[1];
            var template = templateData[templateType][index];

            // 커스텀 이벤트 발생
            $(this).trigger("customEvent", [template]);
        });

        // 초기 렌더링
        console.log(this);
        console.log($(this).parent());
        console.log($(this).parent().find(".template-container"));
        $(this).each(function () {
            const templateType = $(this).parent().find(".template-container").attr("class").split(" ")[1];
            renderTemplates($(this).parent().find(".template-container"), templateType);
        });
    };
})(jQuery);
