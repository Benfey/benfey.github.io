// Code block enhancements - copy functionality and wrapper setup

export function initCodeBlocks() {
    // Wrap code blocks and add copy buttons
    const codeBlocks = document.querySelectorAll('.highlight');
    
    codeBlocks.forEach(block => {
        // Skip if already wrapped
        if (block.parentElement.classList.contains('code-block-wrapper')) {
            return;
        }
        
        // Create wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'code-block-wrapper';
        
        // Wrap the code block
        block.parentNode.insertBefore(wrapper, block);
        wrapper.appendChild(block);
        
        // Create copy button
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button';
        copyButton.textContent = 'Copy';
        copyButton.setAttribute('aria-label', 'Copy code to clipboard');
        
        // Add click handler
        copyButton.addEventListener('click', async () => {
            await copyCodeToClipboard(block, copyButton);
        });
        
        // Add button to wrapper
        wrapper.appendChild(copyButton);
    });
}

async function copyCodeToClipboard(codeBlock, button) {
    try {
        // Get the code content (skip line numbers if present)
        const codeElement = codeBlock.querySelector('code');
        if (!codeElement) return;
        
        // Extract text content, preserving line breaks
        let codeText = '';
        const lines = codeElement.querySelectorAll('.highlight > code, code');
        
        if (lines.length > 0) {
            // If we have structured lines, process them
            lines.forEach(line => {
                codeText += line.textContent + '\n';
            });
        } else {
            // Fallback to simple text content
            codeText = codeElement.textContent;
        }
        
        // Clean up extra whitespace
        codeText = codeText.trim();
        
        // Use the Clipboard API
        await navigator.clipboard.writeText(codeText);
        
        // Update button state
        const originalText = button.textContent;
        button.textContent = 'Copied!';
        button.classList.add('copied');
        
        // Reset after 2 seconds
        setTimeout(() => {
            button.textContent = originalText;
            button.classList.remove('copied');
        }, 2000);
        
    } catch (error) {
        console.warn('Failed to copy code:', error);
        
        // Fallback for older browsers
        fallbackCopyToClipboard(codeBlock, button);
    }
}

function fallbackCopyToClipboard(codeBlock, button) {
    try {
        // Create a temporary textarea
        const textarea = document.createElement('textarea');
        const codeElement = codeBlock.querySelector('code');
        
        if (!codeElement) return;
        
        textarea.value = codeElement.textContent.trim();
        document.body.appendChild(textarea);
        
        // Select and copy
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        
        // Update button state
        const originalText = button.textContent;
        button.textContent = 'Copied!';
        button.classList.add('copied');
        
        setTimeout(() => {
            button.textContent = originalText;
            button.classList.remove('copied');
        }, 2000);
        
    } catch (error) {
        console.warn('Fallback copy failed:', error);
        
        // Show error state
        button.textContent = 'Failed';
        setTimeout(() => {
            button.textContent = 'Copy';
        }, 2000);
    }
}