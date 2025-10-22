/**
 * CSVParserService
 * 
 * Handles parsing and validation of CSV files from various bank formats.
 * Supports common formats from Chase, Bank of America, Wells Fargo, and generic CSV.
 */

export interface ParsedTransaction {
  date: string; // ISO date string
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category?: string;
  notes?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface BankFormat {
  name: string;
  dateColumn: string;
  descriptionColumn: string;
  amountColumn: string;
  typeColumn?: string;
}

export interface DuplicateCheck {
  duplicates: ParsedTransaction[];
  unique: ParsedTransaction[];
}

const SUPPORTED_FORMATS: BankFormat[] = [
  {
    name: 'Generic',
    dateColumn: 'date',
    descriptionColumn: 'description',
    amountColumn: 'amount',
  },
  {
    name: 'Chase',
    dateColumn: 'Transaction Date',
    descriptionColumn: 'Description',
    amountColumn: 'Amount',
  },
  {
    name: 'Bank of America',
    dateColumn: 'Date',
    descriptionColumn: 'Description',
    amountColumn: 'Amount',
  },
  {
    name: 'Wells Fargo',
    dateColumn: 'Date',
    descriptionColumn: 'Description',
    amountColumn: 'Amount',
  },
];

export class CSVParserService {
  /**
   * Parse CSV file and extract transactions
   */
  async parseCSV(file: File): Promise<ParsedTransaction[]> {
    const text = await file.text();
    const lines = text.split('\n').filter(line => line.trim());

    if (lines.length < 2) {
      throw new Error('CSV file is empty or has no data rows');
    }

    // Parse header
    const headers = this.parseCSVLine(lines[0]);
    
    // Detect format
    const format = this.detectFormat(headers);
    
    if (!format) {
      throw new Error('Could not detect CSV format. Required columns: date, description, amount');
    }
    
    // Parse data rows
    const transactions: ParsedTransaction[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      try {
        const values = this.parseCSVLine(lines[i]);
        const transaction = this.parseTransaction(headers, values, format);
        if (transaction) {
          transactions.push(transaction);
        }
      } catch (error) {
        console.warn(`Failed to parse line ${i + 1}:`, error);
        // Continue parsing other lines
      }
    }

    return transactions;
  }

  /**
   * Validate CSV file format and content
   */
  async validateCSV(file: File): Promise<ValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      errors.push('File size exceeds 10MB limit');
    }

    // Check file type
    if (!file.name.endsWith('.csv')) {
      errors.push('File must be a CSV file (.csv extension)');
    }

    // Try to parse and validate content
    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());

      if (lines.length < 2) {
        errors.push('CSV file must have at least a header row and one data row');
      }

      // Check headers
      const headers = this.parseCSVLine(lines[0]);
      const format = this.detectFormat(headers);

      if (!format) {
        errors.push(
          'Could not detect CSV format. Required columns: date, description, amount'
        );
      }

      // Check for data
      if (lines.length > 10000) {
        warnings.push(
          `File contains ${lines.length - 1} transactions. Large files may take longer to process.`
        );
      }

      // Validate sample rows
      const sampleSize = Math.min(5, lines.length - 1);
      for (let i = 1; i <= sampleSize; i++) {
        try {
          const values = this.parseCSVLine(lines[i]);
          this.parseTransaction(headers, values, format!);
        } catch (error) {
          warnings.push(`Row ${i + 1} has invalid data: ${error}`);
        }
      }
    } catch (error) {
      errors.push(`Failed to read file: ${error}`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Detect CSV format based on headers
   */
  detectFormat(headers: string[]): BankFormat | null {
    const normalizedHeaders = headers.map(h => h.toLowerCase().trim());

    // Try to match known formats
    for (const format of SUPPORTED_FORMATS) {
      const hasDate = normalizedHeaders.some(h =>
        h.includes(format.dateColumn.toLowerCase())
      );
      const hasDescription = normalizedHeaders.some(h =>
        h.includes(format.descriptionColumn.toLowerCase())
      );
      const hasAmount = normalizedHeaders.some(h =>
        h.includes(format.amountColumn.toLowerCase())
      );

      if (hasDate && hasDescription && hasAmount) {
        return format;
      }
    }

    // Try generic column names
    const hasDate = normalizedHeaders.some(h => h.includes('date'));
    const hasDescription = normalizedHeaders.some(h =>
      h.includes('description') || h.includes('memo') || h.includes('details')
    );
    const hasAmount = normalizedHeaders.some(h =>
      h.includes('amount') || h.includes('value') || h.includes('total')
    );

    if (hasDate && hasDescription && hasAmount) {
      return SUPPORTED_FORMATS[0]; // Generic format
    }

    return null;
  }

  /**
   * Check for duplicate transactions
   */
  async checkDuplicates(
    transactions: ParsedTransaction[],
    existingTransactions: ParsedTransaction[]
  ): Promise<DuplicateCheck> {
    const duplicates: ParsedTransaction[] = [];
    const unique: ParsedTransaction[] = [];

    for (const transaction of transactions) {
      const isDuplicate = existingTransactions.some(
        existing =>
          existing.date === transaction.date &&
          existing.description === transaction.description &&
          Math.abs(existing.amount - transaction.amount) < 0.01 // Account for floating point
      );

      if (isDuplicate) {
        duplicates.push(transaction);
      } else {
        unique.push(transaction);
      }
    }

    return { duplicates, unique };
  }

  /**
   * Parse a single CSV line handling quoted values
   */
  private parseCSVLine(line: string): string[] {
    const values: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }

    values.push(current.trim());
    return values;
  }

  /**
   * Parse a transaction from CSV row
   */
  private parseTransaction(
    headers: string[],
    values: string[],
    format: BankFormat
  ): ParsedTransaction | null {
    // Find column indexes
    const dateIndex = this.findColumnIndex(headers, format.dateColumn);
    const descriptionIndex = this.findColumnIndex(headers, format.descriptionColumn);
    const amountIndex = this.findColumnIndex(headers, format.amountColumn);

    if (dateIndex === -1 || descriptionIndex === -1 || amountIndex === -1) {
      return null;
    }

    // Extract values
    const dateStr = values[dateIndex];
    const description = values[descriptionIndex];
    const amountStr = values[amountIndex];

    if (!dateStr || !description || !amountStr) {
      return null;
    }

    // Parse date
    const date = this.parseDate(dateStr);
    if (!date) {
      throw new Error(`Invalid date: ${dateStr}`);
    }

    // Parse amount
    const amount = this.parseAmount(amountStr);
    if (isNaN(amount)) {
      throw new Error(`Invalid amount: ${amountStr}`);
    }

    // Determine type (income vs expense)
    const type = amount >= 0 ? 'income' : 'expense';

    return {
      date: date.toISOString().split('T')[0], // YYYY-MM-DD
      description: description.trim(),
      amount: Math.abs(amount),
      type,
    };
  }

  /**
   * Find column index by name (case-insensitive)
   */
  private findColumnIndex(headers: string[], columnName: string): number {
    const normalized = columnName.toLowerCase();
    return headers.findIndex(h => h.toLowerCase().includes(normalized));
  }

  /**
   * Parse date string to Date object
   * Supports formats: MM/DD/YYYY, YYYY-MM-DD, DD/MM/YYYY
   */
  private parseDate(dateStr: string): Date | null {
    // Try ISO format (YYYY-MM-DD)
    let date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return date;
    }

    // Try MM/DD/YYYY
    const parts = dateStr.split(/[/-]/);
    if (parts.length === 3) {
      // Try MM/DD/YYYY
      date = new Date(parseInt(parts[2]), parseInt(parts[0]) - 1, parseInt(parts[1]));
      if (!isNaN(date.getTime())) {
        return date;
      }

      // Try DD/MM/YYYY
      date = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
      if (!isNaN(date.getTime())) {
        return date;
      }
    }

    return null;
  }

  /**
   * Parse amount string to number
   * Handles: $1,234.56, (1234.56), -1234.56, 1234.56
   */
  private parseAmount(amountStr: string): number {
    // Remove currency symbols and whitespace
    let cleaned = amountStr.replace(/[$€£¥\s]/g, '');

    // Handle parentheses (negative)
    const isNegative = cleaned.startsWith('(') && cleaned.endsWith(')');
    if (isNegative) {
      cleaned = cleaned.slice(1, -1);
    }

    // Remove commas
    cleaned = cleaned.replace(/,/g, '');

    // Parse number
    let amount = parseFloat(cleaned);

    // Apply negative if in parentheses
    if (isNegative) {
      amount = -amount;
    }

    return amount;
  }
}

// Export singleton instance
export const csvParserService = new CSVParserService();
