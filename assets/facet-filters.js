class FacetFilters extends HTMLElement {
  constructor() {
    super();
    this.facetForm = this.querySelector('form[data-filter-facet-form]');
    this.filterOpenBtns = document.querySelectorAll('[data-filter-open]');
    this.activeInputs = Array.from(
        this.facetForm.querySelectorAll('.plp-filter-value input[type="checkbox"]:checked')
    );
    this.setListeners();
  }

  getActiveInputs(){
    const activeInputs = Array.from(
        this.facetForm.querySelectorAll('.plp-filter-value input[type="checkbox"]:checked')
    );

    return activeInputs;
  }

  setListeners() {
    const filterClose = this.querySelectorAll('[data-filter-close]');
    const facetItems = this.querySelectorAll(".plp-filter-items .btn-filter-title");
    const filterApplyBtns = this.querySelectorAll('[data-filter-apply]');
    const clearAllFilterBtns = this.querySelectorAll('[data-filter-clear-all]');
    
    facetItems.forEach(button => {
        button.addEventListener('click', evt => {
            const facet = button.dataset.facet;
            if (!facet) return;
            const facetActiveClassName = "active";
            facetItems.forEach(btn => {
                btn.classList.remove(facetActiveClassName)
                btn.setAttribute('aria-expanded', false);
            });
            button.classList.add(facetActiveClassName);
            button.setAttribute('aria-expanded', true);
        });
    });

    this.filterOpenBtns.forEach(btn => {
        btn.addEventListener('click', this.openFilter.bind(this));
    });

    filterClose.forEach(btn => {
        btn.addEventListener('click', this.closeFilter.bind(this));
    });

    filterApplyBtns.forEach(btn => {
        btn.addEventListener('click', evt => {
            evt.preventDefault();
            let shouldApply = false;
            const activeInputs = this.getActiveInputs();
            if(activeInputs.length !== this.activeInputs.length) shouldApply = true;
            if(!shouldApply){
                const anyLeft = activeInputs.filter(input => {
                    return !this.activeInputs.some(activeInput => activeInput === input)
                })[0];
                if(anyLeft) shouldApply = true;
            }

            if(shouldApply) this.submitForm();
            else this.closeFilter();
        });
    });

    clearAllFilterBtns.forEach(btn => {
        btn.addEventListener('click', evt => {
            const inputs = this.facetForm.querySelectorAll('.plp-filter-value input[type="checkbox"]');
            inputs.forEach(input => {
                input.checked = false;
            });
            this.submitForm();
        });
    });
    
  }

  submitForm(){
    this.facetForm.submit();
  }

  openFilter(evt){
    if(evt && evt.target) {
        evt.preventDefault();
        evt.stopPropagation()
        evt.target.setAttribute('aria-expanded', true);
    }
    $(this).find('.plp-filter-model').stop().slideDown();
    document.body.classList.add('scroll-stop');
    this.setAttribute('open', true);
    _theme.focusTrap($(this), ($self) => {
        if(evt && evt.target) evt.target.focus();
    });
  }

  closeFilter(evt){
    if(evt && evt.target) {
        evt.preventDefault();
        evt.stopPropagation()
    }
    this.filterOpenBtns.forEach(btn => btn.setAttribute('aria-expanded', false));
    this.removeAttribute('open');
    $(this).find('.plp-filter-model').stop().slideUp();
    this.filterOpenBtns[0].focus();
    document.body.classList.remove('scroll-stop');
  }
}

window.addEventListener("DOMContentLoaded", (evt) => {
  customElements.define("facet-filters-form", FacetFilters);
});