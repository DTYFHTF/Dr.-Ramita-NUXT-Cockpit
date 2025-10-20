/**
 * Currency formatting utilities for Indian Rupee (₹)
 */

export const useCurrency = () => {
  /**
   * Format a number as Indian Rupee currency
   * @param amount - The amount to format
   * @param showDecimals - Whether to show decimal places (default: true)
   * @returns Formatted currency string with ₹ symbol
   */
  const formatCurrency = (amount: number | string | null | undefined, showDecimals = true): string => {
    if (amount === null || amount === undefined || amount === '') {
      return '₹0';
    }

    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    
    if (isNaN(numAmount)) {
      return '₹0';
    }

    // Format with Indian numbering system (lakhs/crores)
    const formatted = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: showDecimals ? 2 : 0,
      maximumFractionDigits: showDecimals ? 2 : 0,
    }).format(numAmount);

    return formatted;
  };

  /**
   * Format a number as compact Indian Rupee (e.g., ₹1.5K, ₹2.3L)
   * @param amount - The amount to format
   * @returns Compact formatted currency string
   */
  const formatCompactCurrency = (amount: number | string | null | undefined): string => {
    if (amount === null || amount === undefined || amount === '') {
      return '₹0';
    }

    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    
    if (isNaN(numAmount)) {
      return '₹0';
    }

    // Use compact notation for large numbers
    const formatted = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(numAmount);

    return formatted;
  };

  /**
   * Get the rupee symbol
   * @returns The Indian Rupee symbol
   */
  const getCurrencySymbol = (): string => {
    return '₹';
  };

  return {
    formatCurrency,
    formatCompactCurrency,
    getCurrencySymbol,
  };
};
