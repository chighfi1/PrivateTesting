# Branch Testing Strategy Documentation

This document explains the comprehensive branch testing strategy implemented for the UserAddressComponent, demonstrating how to achieve high code coverage and test all execution paths.

## Overview

The business logic methods in `UserAddressComponent` have been specifically designed to contain multiple branches and decision points, making them excellent examples for demonstrating branch testing techniques.

## Methods and Their Branches

### 1. `determineAddressType()` - 4 Main Branches

**Branch Coverage:**
- **Branch 1**: PO Box detection (4 sub-branches)
  - `po box` pattern
  - `p.o. box` pattern  
  - `p o box` pattern
  - `post office box` pattern
- **Branch 2**: Commercial detection (8 sub-branches)
  - `suite`, `ste`, `floor`, `building`, `office`, `plaza`, `center`, `mall`
- **Branch 3**: Residential apartment detection (4 sub-branches)
  - `apt`, `apartment`, `unit`, `#`
- **Branch 4**: Default residential case

**Test Cases:**
```typescript
// Tests each pattern and decision path
it('should return "po-box" for PO Box addresses - Branch 1a')
it('should return "commercial" for suite addresses - Branch 2a')
it('should return "residential" for apartment addresses - Branch 3a')
it('should return "residential" for default case - Branch 4')
```

### 2. `calculateShippingCost()` - 4 Main Branches

**Branch Coverage:**
- **Branch 1**: International shipping (2 sub-branches)
  - Premium destinations (Canada/Mexico)
  - Standard international
- **Branch 2**: State-specific multipliers (domestic only)
- **Branch 3**: Address type surcharges (3 sub-branches)
  - PO Box surcharge
  - Commercial surcharge
  - No surcharge
- **Branch 4**: Minimum cost validation

**Test Cases:**
```typescript
// Tests international vs domestic paths
it('should calculate international shipping cost - Branch 1')
it('should apply state multiplier for Hawaii - Branch 2')
it('should add PO Box surcharge - Branch 3a')
it('should apply minimum shipping cost - Branch 4')
```

### 3. `validateAddressForShipping()` - 7 Main Branches

**Branch Coverage:**
- **Branch 1**: PO Box validation (immediate false)
- **Branch 2**: ZIP code format validation
- **Branch 3**: Street address length validation
- **Branch 4**: City validation
- **Branch 5**: State validation
- **Branch 6**: International address validation (2 sub-branches)
  - Country length validation
  - Restricted country validation
- **Branch 7**: All validations passed (true)

**Test Cases:**
```typescript
// Tests each validation rule
it('should return false for PO Box addresses - Branch 1')
it('should return false for invalid ZIP code - Branch 2')
it('should return false for short street address - Branch 3')
it('should return true for valid domestic address - Branch 7')
```

### 4. `findRecommendedAddress()` - 7 Main Branches

**Branch Coverage:**
- **Branch 1**: No addresses/null input
- **Branch 2**: Filter valid addresses
- **Branch 3**: No valid addresses
- **Branch 4**: Single valid address
- **Branch 5**: Multiple valid addresses
- **Branch 6**: Tie-breaking logic (3 sub-branches)
  - Prefer primary address
  - Prefer domestic address
  - Prefer residential address
- **Branch 7**: Return first when all tie-breakers fail

**Test Cases:**
```typescript
// Tests each decision path and tie-breaker
it('should return undefined for empty array - Branch 1')
it('should return single valid address - Branch 4')
it('should prefer primary address when costs are equal - Branch 6')
```

### 5. `calculateAverageShippingCost()` - 4 Main Branches

**Branch Coverage:**
- **Branch 1**: No addresses/null input
- **Branch 2**: Single address
- **Branch 3**: Multiple addresses calculation
- **Branch 4**: Rounding logic

**Test Cases:**
```typescript
// Tests each calculation scenario
it('should return 0 for empty array - Branch 1')
it('should return single cost for single address - Branch 2')
it('should calculate average for multiple addresses - Branch 3')
```

## Testing Strategy Benefits

### 1. **Complete Code Coverage**
- Every `if`, `else if`, and `else` statement is tested
- All logical operators (`&&`, `||`) are tested with different combinations
- Edge cases and error conditions are covered

### 2. **Real-World Scenarios**
- Tests reflect actual business use cases
- Edge cases mirror real data validation needs
- Error conditions test system resilience

### 3. **Maintainability**
- Clear test names indicate which branch is being tested
- Easy to identify missing coverage
- Simple to add new tests when adding new branches

### 4. **Documentation Value**
- Tests serve as living documentation
- Shows expected behavior for all input combinations
- Demonstrates business rules and validation logic

## Running Branch Coverage

To see the branch coverage in action:

```bash
# Run tests with coverage
npm test -- --code-coverage

# View coverage report
# Coverage report will show:
# - Lines covered: Should be 100%
# - Branches covered: Should be 100%
# - Functions covered: Should be 100%
```

## Best Practices Demonstrated

### 1. **Descriptive Test Names**
```typescript
// Good: Describes the branch and expected outcome
it('should return false for PO Box addresses - Branch 1')

// Bad: Vague test name
it('should validate address')
```

### 2. **One Branch Per Test**
```typescript
// Good: Tests single branch
it('should return "po-box" for PO Box addresses - Branch 1a')

// Bad: Tests multiple branches in one test
it('should determine address type correctly')
```

### 3. **Comprehensive Input Coverage**
```typescript
// Tests various input combinations
- Valid inputs
- Invalid inputs
- Edge cases (empty, null, undefined)
- Boundary values
- Different data types
```

### 4. **Clear Arrange-Act-Assert Pattern**
```typescript
it('should return false for invalid ZIP code - Branch 2', () => {
  // Arrange
  const address: Address = { /* test data */ };
  
  // Act
  const result = (component as any).validateAddressForShipping(address, 'residential');
  
  // Assert
  expect(result).toBe(false);
});
```

## Branch Testing Metrics

With the implemented tests, you should achieve:

- **Line Coverage**: 100%
- **Branch Coverage**: 100%
- **Function Coverage**: 100%
- **Statement Coverage**: 100%

## Integration with CI/CD

```yaml
# Example GitHub Actions workflow
- name: Run tests with coverage
  run: npm test -- --code-coverage --watch=false

- name: Enforce coverage thresholds
  run: |
    # Fail build if coverage drops below thresholds
    npm test -- --code-coverage --watch=false --browsers=ChromeHeadless
```

## Extending Branch Coverage

When adding new business logic:

1. **Add new branches intentionally**
2. **Write tests for each new branch**
3. **Consider edge cases**
4. **Update documentation**
5. **Verify coverage metrics**

This approach ensures that every line of business logic is thoroughly tested and reliable in production.
