# Tests

This directory is for any automated tests we add.

Currently, the project is simple enough that manual testing suffices:

## Manual Testing Checklist

### Basic Functionality
- [ ] Open `src/index.html` in Chrome, Firefox, and Safari
- [ ] All six tabs are visible and clickable
- [ ] Clicking a tab shows the correct canvas
- [ ] Checkboxes can be checked and unchecked
- [ ] Text areas accept input

### Auto-Save
- [ ] Type in a text area, wait a moment, refresh the page
- [ ] Your text should still be there
- [ ] Checkboxes should maintain their state after refresh

### Export/Import
- [ ] Click Export and verify a JSON file downloads
- [ ] Clear all data
- [ ] Click Import and select the exported file
- [ ] Verify your data was restored

### Accessibility
- [ ] Tab through the interface using only keyboard
- [ ] All interactive elements should be reachable
- [ ] Focus states should be visible
- [ ] Tab navigation between canvases should work with arrow keys

### Print
- [ ] Click Print on any canvas
- [ ] Verify the print preview looks reasonable
- [ ] Navigation and buttons should be hidden in print view

### Responsive Design
- [ ] Resize browser to mobile width (~375px)
- [ ] Content should still be usable
- [ ] Tabs should wrap or scroll

## Future Automated Tests

If we add a build step, we might add:
- Accessibility audit (axe-core)
- Cross-browser testing (Playwright)
- Link checking for documentation


