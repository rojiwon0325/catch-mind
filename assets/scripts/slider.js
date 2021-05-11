class Slider {
    constructor(domNode) {
        this.sliderNode = domNode;
        this.min = 0;
        this.max = 100;
        this.value = 0;
        this.unit = '';
        this.railHeight = 0;
        this.handlerWidth = 0;
        this.handlerHeight = 0;
        this.railNode = null;
        this.valueNode = null;
        this.handlerNode = null;
    }
    init() {
        this.findDOMAndInit();
        this.addEvent();
        this.moveSliderTo(this.value);
    }
    findDOMAndInit() {
        const { sliderNode } = this;

        this.railNode = sliderNode.querySelector(".slider__rail");
        this.handlerNode = sliderNode.querySelector(".slider__handler");
        this.valueNode = sliderNode.querySelector(".slider__value");
        // setting
        if (this.handlerNode.tabIndex !== 0) {
            this.handlerNode.tabIndex = 0;
        }
        if (this.handlerNode.getAttribute("role") !== "slider") {
            this.handlerNode.setAttribute("role", "slider");
        }
        let valuemin = parseInt(this.handlerNode.getAttribute("aria-valuemin"), 10);
        this.min = valuemin ? valuemin : this.min;

        let valuemax = parseInt(this.handlerNode.getAttribute("aria-valuemax"), 10);
        this.max = valuemax ? valuemax : this.max;

        let valuenow = parseInt(this.handlerNode.getAttribute("aria-valuenow"), 10);
        this.value = valuenow ? valuenow : this.value;
        if (this.valueNode) {
            this.valueNode.textContent = this.value + this.unit;
        }
        this.railHeight = this.railNode.getBoundingClientRect().height;
        this.handlerWidth = this.handlerNode.getBoundingClientRect().width;
        this.handlerHeight = this.handlerNode.getBoundingClientRect().height;
    }
    addEvent() {
        const { handlerNode, railNode } = this;
        handlerNode.addEventListener("focus", (e) => {
            e.target.classList.add("slider__handler--focus");
        });
        handlerNode.addEventListener("blur", (e) => {
            e.target.classList.remove("slider__handler--focus");
        });

        const handleMove = (e) => {
            const pointerPosition = Math.round(e.pageY - railNode.getBoundingClientRect().y);
            const pointerValue = Math.round((pointerPosition / this.railHeight) * (this.max - this.min));
            this.moveSliderTo(pointerValue);
        };
        const handleUp = () => {
            document.removeEventListener("pointermove", handleMove);
            document.removeEventListener("pointerUp", handleUp);
        };
        const handleDown = (e) => {
            document.addEventListener("pointermove", handleMove);
            document.addEventListener("pointerup", handleUp);
            const pointerPosition = Math.round(e.pageY - railNode.getBoundingClientRect().y);
            const pointerValue = Math.round((pointerPosition / this.railHeight) * (this.max - this.min));
            this.moveSliderTo(pointerValue);
        };
        handlerNode.addEventListener("pointerdown", handleDown);
        railNode.addEventListener("pointerdown", handleDown);
    }
    moveSliderTo(value) {
        const { min, max, unit, handlerNode, valueNode, railHeight, handlerHeight } = this;
        value = value < min ? min : value > max ? max : value;
        valueNode
            ? (valueNode.textContent = value + unit)
            : handlerNode.setAttribute("aria-valuetext", value + unit);
        const handlerPosition = Math.round(railHeight * (value - min) / (max - min)) - handlerHeight / 2;
        handlerNode.style.top = handlerPosition + "px";
        this.value = value;
        this.sliderNode.dispatchEvent(new Event("change"));
    }
}

export default Slider;