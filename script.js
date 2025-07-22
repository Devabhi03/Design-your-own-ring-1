
        document.addEventListener('DOMContentLoaded', function() {
            // Theme toggle
            const themeToggle = document.getElementById('theme-toggle');
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            
            if (prefersDark) {
                document.documentElement.classList.add('dark');
                themeToggle.innerHTML = '<i class="fas fa-sun text-yellow-300"></i>';
            }
            
            themeToggle.addEventListener('click', () => {
                document.documentElement.classList.toggle('dark');
                if (document.documentElement.classList.contains('dark')) {
                    themeToggle.innerHTML = '<i class="fas fa-sun text-yellow-300"></i>';
                } else {
                    themeToggle.innerHTML = '<i class="fas fa-moon text-gray-800"></i>';
                }
            });
            
            // Current step tracking
            let currentStep = 1;
            const totalSteps = 4;
            
            // User selections
            const selections = {
                metal: null,
                diamond: null,
                style: null
            };
            
            // Prices
            const prices = {
                metal: 0,
                diamond: 0,
                style: 0
            };
            
            // DOM elements
            const stepContents = document.querySelectorAll('.step-content');
            const prevBtn = document.getElementById('prev-btn');
            const nextBtn = document.getElementById('next-btn');
            const currentStepEl = document.getElementById('current-step');
            const stepNameEl = document.getElementById('step-name');
            const progressFill = document.querySelector('.progress-fill');
            
            // Preview elements
            const previewMetal = document.getElementById('preview-metal');
            const previewDiamond = document.getElementById('preview-diamond');
            const previewStyle = document.getElementById('preview-style');
            const previewTotal = document.getElementById('preview-total');
            
            // Summary elements
            const summaryMetal = document.getElementById('summary-metal');
            const summaryDiamond = document.getElementById('summary-diamond');
            const summaryStyle = document.getElementById('summary-style');
            const summaryMetalPrice = document.getElementById('summary-metal-price');
            const summaryDiamondPrice = document.getElementById('summary-diamond-price');
            const summaryStylePrice = document.getElementById('summary-style-price');
            const summaryTotal = document.getElementById('summary-total');
            
            // Ring preview elements
            const ringBase = document.getElementById('ring-base');
            const diamondPreview = document.getElementById('diamond-preview');
            
            // Option cards
            const optionCards = document.querySelectorAll('.option-card');
            
            // Step names
            const stepNames = [
                'Choose Base Metal',
                'Select Your Diamond',
                'Select Your Ring Style',
                'Review Your Custom Ring'
            ];
            
            // Initialize
            updateStep();
            updatePreview();
            
            // Navigation
            nextBtn.addEventListener('click', function() {
                if (currentStep < totalSteps) {
                    currentStep++;
                    updateStep();
                } else if (currentStep === totalSteps) {
                    submitOrder();
                }
            });
            
            prevBtn.addEventListener('click', function() {
                if (currentStep > 1) {
                    currentStep--;
                    updateStep();
                }
            });
            
            // Option selection
            optionCards.forEach(card => {
                card.addEventListener('click', function() {
                    // Remove selected class from all cards in this step
                    const parent = this.closest('.step-content');
                    parent.querySelectorAll('.option-card').forEach(c => {
                        c.classList.remove('selected');
                    });
                    
                    // Add selected class to clicked card
                    this.classList.add('selected');
                    
                    // Save selection
                    const value = this.getAttribute('data-value');
                    const price = parseInt(this.getAttribute('data-price'));
                    
                    if (currentStep === 1) {
                        selections.metal = value;
                        prices.metal = price;
                        
                        // Update ring base color
                        if (value === 'gold') {
                            ringBase.classList.remove('border-rose-300', 'border-gray-300');
                            ringBase.classList.add('border-yellow-400');
                            ringBase.style.backgroundColor = '#FFD700';
                        } else if (value === 'platinum') {
                            ringBase.classList.remove('border-yellow-400', 'border-rose-300');
                            ringBase.classList.add('border-gray-300');
                            ringBase.style.backgroundColor = '#E5E4E2';
                        } else if (value === 'rose-gold') {
                            ringBase.classList.remove('border-yellow-400', 'border-gray-300');
                            ringBase.classList.add('border-rose-300');
                            ringBase.style.backgroundColor = '#B76E79';
                        }
                    } else if (currentStep === 2) {
                        selections.diamond = value;
                        prices.diamond = price;
                        
                        // Show diamond preview with correct shape
                        diamondPreview.classList.remove('opacity-0');
                        const diamondSvg = document.getElementById('diamond-svg');
                        diamondSvg.innerHTML = '';
                        
                        if (value === 'round') {
                            diamondSvg.innerHTML = '<polygon points="50,0 65,35 100,35 75,60 85,100 50,80 15,100 25,60 0,35 35,35" fill="#e0f2fe" stroke="#bae6fd" stroke-width="2"/>';
                        } else if (value === 'princess') {
                            diamondSvg.innerHTML = '<rect x="20" y="20" width="60" height="60" fill="#e0f2fe" stroke="#bae6fd" stroke-width="2" transform="rotate(45 50 50)"/>';
                        } else if (value === 'oval') {
                            diamondSvg.innerHTML = '<ellipse cx="50" cy="50" rx="35" ry="25" fill="#e0f2fe" stroke="#bae6fd" stroke-width="2"/>';
                        }
                    } else if (currentStep === 3) {
                        selections.style = value;
                        prices.style = price;
                    }
                    
                    updatePreview();
                });
            });
            
            // Submit order
            document.getElementById('submit-order').addEventListener('click', submitOrder);
            
            // Design another
            document.getElementById('design-another').addEventListener('click', function() {
                // Reset everything
                currentStep = 1;
                selections.metal = null;
                selections.diamond = null;
                selections.style = null;
                prices.metal = 0;
                prices.diamond = 0;
                prices.style = 0;
                
                // Reset UI
                optionCards.forEach(card => {
                    card.classList.remove('selected');
                });
                
                ringBase.classList.remove('border-yellow-400', 'border-gray-300', 'border-rose-300');
                diamondPreview.classList.add('opacity-0');
                
                updateStep();
                updatePreview();
            });
            
            // Helper functions
            function updateStep() {
                // Hide all steps
                stepContents.forEach(step => {
                    step.classList.add('hidden');
                });
                
                // Show current step
                document.getElementById(`step-${currentStep}`).classList.remove('hidden');
                
                // Update progress
                currentStepEl.textContent = currentStep;
                stepNameEl.textContent = stepNames[currentStep - 1];
                progressFill.style.width = `${(currentStep / totalSteps) * 100}%`;
                
                // Update navigation buttons
                if (currentStep === 1) {
                    prevBtn.classList.add('hidden');
                } else {
                    prevBtn.classList.remove('hidden');
                }
                
                if (currentStep === totalSteps) {
                    nextBtn.textContent = 'Submit Order';
                    updateSummary();
                } else {
                    nextBtn.textContent = 'Next';
                    nextBtn.innerHTML = 'Next <i class="fas fa-arrow-right ml-2"></i>';
                }
            }
            
            function updatePreview() {
                // Update preview text
                previewMetal.textContent = selections.metal ? selections.metal.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Not selected';
                previewDiamond.textContent = selections.diamond ? selections.diamond.charAt(0).toUpperCase() + selections.diamond.slice(1) : 'Not selected';
                previewStyle.textContent = selections.style ? selections.style.charAt(0).toUpperCase() + selections.style.slice(1) : 'Not selected';
                
                // Calculate and update total
                const total = prices.metal + prices.diamond + prices.style;
                previewTotal.textContent = `₹${total.toLocaleString()}`;
            }
            
            function updateSummary() {
                summaryMetal.textContent = selections.metal ? selections.metal.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Not selected';
                summaryDiamond.textContent = selections.diamond ? selections.diamond.charAt(0).toUpperCase() + selections.diamond.slice(1) : 'Not selected';
                summaryStyle.textContent = selections.style ? selections.style.charAt(0).toUpperCase() + selections.style.slice(1) : 'Not selected';
                
                summaryMetalPrice.textContent = `₹${prices.metal.toLocaleString()}`;
                summaryDiamondPrice.textContent = `₹${prices.diamond.toLocaleString()}`;
                summaryStylePrice.textContent = `₹${prices.style.toLocaleString()}`;
                
                const total = prices.metal + prices.diamond + prices.style;
                summaryTotal.textContent = `₹${total.toLocaleString()}`;
            }
            
            function submitOrder() {
                console.log('Order submitted:', { selections, prices });
                
                // Show thank you message
                document.getElementById('thank-you').classList.remove('hidden');
                
                // Hide other steps
                stepContents.forEach(step => {
                    if (!step.id.includes('thank-you')) {
                        step.classList.add('hidden');
                    }
                });
                
                // Hide navigation buttons
                prevBtn.classList.add('hidden');
                nextBtn.classList.add('hidden');
                
                // Auto-redirect after 3 seconds
                setTimeout(() => {
                    currentStep = 1;
                    updateStep();
                    document.getElementById('thank-you').classList.add('hidden');
                    prevBtn.classList.add('hidden');
                    nextBtn.classList.remove('hidden');
                    nextBtn.textContent = 'Next';
                    nextBtn.innerHTML = 'Next <i class="fas fa-arrow-right ml-2"></i>';
                }, 3000);
            }
        });
 