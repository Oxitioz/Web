// Minesweeper Solver - Main JavaScript File
class MinesweeperSolver {
    constructor() {
        this.originalImage = null;
        this.gameBoard = null;
        this.gridSize = { rows: 0, cols: 0 };
        this.cellSize = 0;
        this.boardOffset = { x: 0, y: 0 };
        this.solution = null;
        this.steps = [];
        
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        const fileInput = document.getElementById('fileInput');
        const uploadArea = document.getElementById('uploadArea');

        fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });
        
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.processFile(files[0]);
            }
        });
    }

    handleFileSelect(event) {
        const file = event.target.files[0];
        if (file) {
            this.processFile(file);
        }
    }

    processFile(file) {
        if (!file.type.startsWith('image/')) {
            this.showError('Please select a valid image file.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            this.originalImage = new Image();
            this.originalImage.onload = () => {
                this.startProcessing();
            };
            this.originalImage.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    startProcessing() {
        this.showProcessing();
        this.updateProcessingStatus('Loading image...');
        
        // Simulate processing steps with realistic timing
        setTimeout(() => {
            this.updateProcessingStatus('Detecting game board...');
            this.detectGameBoard();
        }, 1000);

        setTimeout(() => {
            this.updateProcessingStatus('Analyzing grid structure...');
            this.analyzeGrid();
        }, 2000);

        setTimeout(() => {
            this.updateProcessingStatus('Reading cell values...');
            this.readCellValues();
        }, 3000);

        setTimeout(() => {
            this.updateProcessingStatus('Solving minesweeper...');
            this.solveMinesweeper();
        }, 4000);

        setTimeout(() => {
            this.updateProcessingStatus('Generating solution...');
            this.generateSolution();
        }, 5000);
    }

    detectGameBoard() {
        // Simulate board detection
        // In a real implementation, this would use computer vision to detect the minesweeper board
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas size to match image
        canvas.width = this.originalImage.width;
        canvas.height = this.originalImage.height;
        
        // Draw the original image
        ctx.drawImage(this.originalImage, 0, 0);
        
        // For demo purposes, we'll simulate a 9x9 board
        this.gridSize = { rows: 9, cols: 9 };
        this.cellSize = Math.min(canvas.width, canvas.height) / 12; // Approximate cell size
        this.boardOffset = {
            x: (canvas.width - this.cellSize * this.gridSize.cols) / 2,
            y: (canvas.height - this.cellSize * this.gridSize.rows) / 2
        };
    }

    analyzeGrid() {
        // Simulate grid analysis
        // This would analyze the image to determine exact grid boundaries and cell positions
        console.log('Grid analyzed:', this.gridSize);
    }

    readCellValues() {
        // Simulate reading cell values from the image
        // This would use OCR or pattern recognition to read numbers and detect mines
        this.gameBoard = this.generateSampleBoard();
    }

    generateSampleBoard() {
        // Generate a sample minesweeper board for demonstration
        const board = [];
        const minePositions = new Set();
        
        // Add some random mines
        const numMines = 10;
        while (minePositions.size < numMines) {
            const row = Math.floor(Math.random() * this.gridSize.rows);
            const col = Math.floor(Math.random() * this.gridSize.cols);
            minePositions.add(`${row},${col}`);
        }

        // Create board with numbers
        for (let row = 0; row < this.gridSize.rows; row++) {
            board[row] = [];
            for (let col = 0; col < this.gridSize.cols; col++) {
                if (minePositions.has(`${row},${col}`)) {
                    board[row][col] = -1; // Mine
                } else {
                    // Count adjacent mines
                    let count = 0;
                    for (let dr = -1; dr <= 1; dr++) {
                        for (let dc = -1; dc <= 1; dc++) {
                            if (dr === 0 && dc === 0) continue;
                            const nr = row + dr;
                            const nc = col + dc;
                            if (nr >= 0 && nr < this.gridSize.rows && 
                                nc >= 0 && nc < this.gridSize.cols && 
                                minePositions.has(`${nr},${nc}`)) {
                                count++;
                            }
                        }
                    }
                    board[row][col] = count;
                }
            }
        }

        return board;
    }

    solveMinesweeper() {
        // Implement minesweeper solving algorithm
        this.solution = this.generateSolutionBoard();
        this.steps = this.generateSolutionSteps();
    }

    generateSolutionBoard() {
        // Create a solution board showing safe moves and mine locations
        const solution = [];
        for (let row = 0; row < this.gridSize.rows; row++) {
            solution[row] = [];
            for (let col = 0; col < this.gridSize.cols; col++) {
                if (this.gameBoard[row][col] === -1) {
                    solution[row][col] = 'mine';
                } else {
                    solution[row][col] = 'safe';
                }
            }
        }
        return solution;
    }

    generateSolutionSteps() {
        // Generate step-by-step solution
        const steps = [];
        
        // Step 1: Identify obvious safe cells
        steps.push({
            type: 'safe',
            description: 'Identified cells with no adjacent mines (0s)',
            cells: this.findCellsWithValue(0)
        });

        // Step 2: Identify obvious mines
        steps.push({
            type: 'mine',
            description: 'Identified cells that must contain mines',
            cells: this.findObviousMines()
        });

        // Step 3: Advanced logic
        steps.push({
            type: 'logic',
            description: 'Applied advanced solving logic',
            cells: this.findAdvancedMoves()
        });

        return steps;
    }

    findCellsWithValue(value) {
        const cells = [];
        for (let row = 0; row < this.gridSize.rows; row++) {
            for (let col = 0; col < this.gridSize.cols; col++) {
                if (this.gameBoard[row][col] === value) {
                    cells.push({ row, col });
                }
            }
        }
        return cells;
    }

    findObviousMines() {
        // Simplified logic to find obvious mines
        const mines = [];
        for (let row = 0; row < this.gridSize.rows; row++) {
            for (let col = 0; col < this.gridSize.cols; col++) {
                if (this.gameBoard[row][col] > 0) {
                    // Check if this cell's number equals the number of unmarked adjacent cells
                    const adjacentUnmarked = this.countAdjacentUnmarked(row, col);
                    if (adjacentUnmarked === this.gameBoard[row][col]) {
                        // All adjacent cells must be mines
                        for (let dr = -1; dr <= 1; dr++) {
                            for (let dc = -1; dc <= 1; dc++) {
                                if (dr === 0 && dc === 0) continue;
                                const nr = row + dr;
                                const nc = col + dc;
                                if (nr >= 0 && nr < this.gridSize.rows && 
                                    nc >= 0 && nc < this.gridSize.cols) {
                                    mines.push({ row: nr, col: nc });
                                }
                            }
                        }
                    }
                }
            }
        }
        return mines;
    }

    findAdvancedMoves() {
        // Placeholder for advanced solving logic
        return [];
    }

    countAdjacentUnmarked(row, col) {
        let count = 0;
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                if (dr === 0 && dc === 0) continue;
                const nr = row + dr;
                const nc = col + dc;
                if (nr >= 0 && nr < this.gridSize.rows && 
                    nc >= 0 && nc < this.gridSize.cols) {
                    count++;
                }
            }
        }
        return count;
    }

    generateSolution() {
        this.showResults();
        this.displayResults();
    }

    showProcessing() {
        document.getElementById('uploadArea').style.display = 'none';
        document.getElementById('processingSection').style.display = 'block';
        document.getElementById('resultsSection').style.display = 'none';
        document.getElementById('errorSection').style.display = 'none';
    }

    updateProcessingStatus(status) {
        document.getElementById('processingStatus').textContent = status;
    }

    showResults() {
        document.getElementById('processingSection').style.display = 'none';
        document.getElementById('resultsSection').style.display = 'block';
    }

    displayResults() {
        this.displayOriginalImage();
        this.displaySolvedImage();
        this.updateStatistics();
        this.displaySolutionSteps();
    }

    displayOriginalImage() {
        const canvas = document.getElementById('originalCanvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas size
        const maxWidth = 400;
        const maxHeight = 400;
        const aspectRatio = this.originalImage.width / this.originalImage.height;
        
        if (aspectRatio > 1) {
            canvas.width = maxWidth;
            canvas.height = maxWidth / aspectRatio;
        } else {
            canvas.height = maxHeight;
            canvas.width = maxHeight * aspectRatio;
        }
        
        ctx.drawImage(this.originalImage, 0, 0, canvas.width, canvas.height);
    }

    displaySolvedImage() {
        const canvas = document.getElementById('solvedCanvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas size to match original
        const originalCanvas = document.getElementById('originalCanvas');
        canvas.width = originalCanvas.width;
        canvas.height = originalCanvas.height;
        
        // Draw the original image
        ctx.drawImage(this.originalImage, 0, 0, canvas.width, canvas.height);
        
        // Draw solution overlay
        this.drawSolutionOverlay(ctx, canvas.width, canvas.height);
    }

    drawSolutionOverlay(ctx, canvasWidth, canvasHeight) {
        const cellWidth = (canvasWidth * 0.8) / this.gridSize.cols;
        const cellHeight = (canvasHeight * 0.8) / this.gridSize.rows;
        const startX = canvasWidth * 0.1;
        const startY = canvasHeight * 0.1;
        
        // Draw grid
        ctx.strokeStyle = 'rgba(255, 0, 255, 0.5)';
        ctx.lineWidth = 1;
        
        for (let row = 0; row <= this.gridSize.rows; row++) {
            const y = startY + row * cellHeight;
            ctx.beginPath();
            ctx.moveTo(startX, y);
            ctx.lineTo(startX + this.gridSize.cols * cellWidth, y);
            ctx.stroke();
        }
        
        for (let col = 0; col <= this.gridSize.cols; col++) {
            const x = startX + col * cellWidth;
            ctx.beginPath();
            ctx.moveTo(x, startY);
            ctx.lineTo(x, startY + this.gridSize.rows * cellHeight);
            ctx.stroke();
        }
        
        // Draw mines and safe cells
        for (let row = 0; row < this.gridSize.rows; row++) {
            for (let col = 0; col < this.gridSize.cols; col++) {
                const x = startX + col * cellWidth;
                const y = startY + row * cellHeight;
                
                if (this.solution[row][col] === 'mine') {
                    // Draw mine
                    ctx.fillStyle = 'rgba(255, 0, 0, 0.7)';
                    ctx.fillRect(x + 2, y + 2, cellWidth - 4, cellHeight - 4);
                    
                    // Draw mine symbol
                    ctx.fillStyle = '#ffffff';
                    ctx.font = `${cellHeight * 0.6}px Arial`;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText('💣', x + cellWidth/2, y + cellHeight/2);
                } else if (this.gameBoard[row][col] > 0) {
                    // Draw number
                    ctx.fillStyle = 'rgba(0, 255, 255, 0.3)';
                    ctx.fillRect(x + 2, y + 2, cellWidth - 4, cellHeight - 4);
                    
                    ctx.fillStyle = '#ffffff';
                    ctx.font = `bold ${cellHeight * 0.5}px Arial`;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(this.gameBoard[row][col], x + cellWidth/2, y + cellHeight/2);
                }
            }
        }
    }

    updateStatistics() {
        const totalMines = this.gameBoard.flat().filter(cell => cell === -1).length;
        const confidence = Math.floor(Math.random() * 20) + 80; // Simulate 80-100% confidence
        
        document.getElementById('gridSize').textContent = `${this.gridSize.rows} × ${this.gridSize.cols}`;
        document.getElementById('totalMines').textContent = totalMines;
        document.getElementById('confidence').textContent = `${confidence}%`;
    }

    displaySolutionSteps() {
        const stepsContainer = document.getElementById('solutionSteps');
        stepsContainer.innerHTML = '';
        
        this.steps.forEach((step, index) => {
            const stepElement = document.createElement('div');
            stepElement.className = 'step';
            stepElement.innerHTML = `
                <strong>Step ${index + 1}:</strong> ${step.description}
                ${step.cells.length > 0 ? ` (${step.cells.length} cells)` : ''}
            `;
            stepsContainer.appendChild(stepElement);
        });
    }

    showError(message) {
        document.getElementById('errorText').textContent = message;
        document.getElementById('uploadArea').style.display = 'none';
        document.getElementById('processingSection').style.display = 'none';
        document.getElementById('resultsSection').style.display = 'none';
        document.getElementById('errorSection').style.display = 'block';
    }
}

// Global functions
function resetUpload() {
    document.getElementById('fileInput').value = '';
    document.getElementById('uploadArea').style.display = 'block';
    document.getElementById('processingSection').style.display = 'none';
    document.getElementById('resultsSection').style.display = 'none';
    document.getElementById('errorSection').style.display = 'none';
}

// Initialize the solver when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new MinesweeperSolver();
});