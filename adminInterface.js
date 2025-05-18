/**
 * E-Response Admin Interface
 * Shared functionality for admin editing capabilities
 */

// Global variable to check if user is admin
const isAdmin = () => {
    return localStorage.getItem('userRole') === 'admin';
  };
  
  // Show edit controls only to admins
  function setupAdminFeatures() {
    if (!isAdmin()) return;
    
    // Add admin edit indicator to the page
    const adminIndicator = document.createElement('div');
    adminIndicator.className = 'admin-indicator';
    adminIndicator.innerHTML = '<span>Admin Mode</span>';
    document.body.appendChild(adminIndicator);
    
    // Add edit buttons to editable elements
    document.querySelectorAll('.editable').forEach(element => {
      const editBtn = document.createElement('button');
      editBtn.className = 'edit-btn';
      editBtn.innerHTML = '✏️';
      editBtn.addEventListener('click', () => makeEditable(element));
      element.appendChild(editBtn);
    });
  }
  
  // Make an element editable
  function makeEditable(element) {
    // Store original content for cancel operation
    const originalContent = element.innerHTML;
    const contentId = element.getAttribute('data-id');
    const contentType = element.getAttribute('data-type');
    
    // Remove edit button while editing
    element.querySelector('.edit-btn').remove();
    
    // Create text input or rich text area based on content type
    let editor;
    if (contentType === 'simple') {
      editor = document.createElement('input');
      editor.type = 'text';
      editor.value = element.textContent.trim();
    } else {
      editor = document.createElement('textarea');
      editor.innerHTML = element.innerHTML.replace(/<button.*?<\/button>/g, '');
    }
    
    editor.className = 'content-editor';
    
    // Create control buttons
    const controls = document.createElement('div');
    controls.className = 'edit-controls';
    controls.innerHTML = `
      <button class="save-btn">Save</button>
      <button class="cancel-btn">Cancel</button>
    `;
    
    // Clear the element and add editor and controls
    const tempContent = element.innerHTML;
    element.innerHTML = '';
    element.appendChild(editor);
    element.appendChild(controls);
    
    // Add event listeners to buttons
    controls.querySelector('.save-btn').addEventListener('click', () => {
      saveContent(contentId, contentType, editor.value || editor.innerHTML, element);
    });
    
    controls.querySelector('.cancel-btn').addEventListener('click', () => {
      element.innerHTML = originalContent;
    });
    
    // Focus on the editor
    editor.focus();
  }
  
  // Save edited content
  function saveContent(id, type, content, element) {
    // Get stored content or initialize new object
    let storedData = JSON.parse(localStorage.getItem('adminEditedContent')) || {};
    
    // Update with new content
    storedData[id] = {type, content};
    
    // Save back to localStorage
    localStorage.setItem('adminEditedContent', JSON.stringify(storedData));
    
    // Update UI
    if (type === 'simple') {
      element.innerHTML = content;
    } else {
      element.innerHTML = content;
    }
    
    // Add back the edit button
    const editBtn = document.createElement('button');
    editBtn.className = 'edit-btn';
    editBtn.innerHTML = '✏️';
    editBtn.addEventListener('click', () => makeEditable(element));
    element.appendChild(editBtn);
    
    // Show confirmation message
    showMessage('Content updated successfully!');
  }
  
  // Load content from localStorage if available
  function loadEditedContent() {
    if (!isAdmin()) return;
    
    const storedData = JSON.parse(localStorage.getItem('adminEditedContent')) || {};
    
    // Apply stored edits to page elements
    Object.keys(storedData).forEach(id => {
      const element = document.querySelector(`[data-id="${id}"]`);
      if (element) {
        const {type, content} = storedData[id];
        
        // Remove edit button if present
        const editBtn = element.querySelector('.edit-btn');
        if (editBtn) editBtn.remove();
        
        // Update content
        if (type === 'simple') {
          element.textContent = content;
        } else {
          element.innerHTML = content;
        }
        
        // Add back edit button
        const newEditBtn = document.createElement('button');
        newEditBtn.className = 'edit-btn';
        newEditBtn.innerHTML = '✏️';
        newEditBtn.addEventListener('click', () => makeEditable(element));
        element.appendChild(newEditBtn);
      }
    });
  }
  
  // Show feedback message
  function showMessage(msg, isError = false) {
    const messageEl = document.createElement('div');
    messageEl.className = `admin-message ${isError ? 'error' : 'success'}`;
    messageEl.textContent = msg;
    document.body.appendChild(messageEl);
    
    setTimeout(() => {
      messageEl.classList.add('fade-out');
      setTimeout(() => messageEl.remove(), 500);
    }, 2000);
  }
  
  // Initialize admin features when DOM is loaded
  document.addEventListener('DOMContentLoaded', () => {
    // Check if admin role is set (for testing, you can set this manually)
    // localStorage.setItem('userRole', 'admin'); // Uncomment to test admin mode
    
    // Setup admin features if user is admin
    setupAdminFeatures();
    
    // Load any previously edited content
    loadEditedContent();
  });