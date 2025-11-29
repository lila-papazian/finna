import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AddExpenseDialog from "./add-expense-dialog";
import { createExpense } from "../../../expenses/actions/expenses-actions";
import { format } from "date-fns";
jest.mock("../../actions/expenses-actions", () => ({
  createExpense: jest.fn(),
}));

describe("AddExpenseDialog", () => {
  const mockCreateExpense = createExpense as jest.Mock;

  beforeAll(() => {
    // Radix UI quirk, Radix Select tries to scroll the selected option into view when opening the select
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Dialog Rendering", () => {
    it("should render the trigger button", () => {
      render(<AddExpenseDialog trigger={<button>Add Expense</button>} />);
      expect(screen.getByText("Add Expense")).toBeInTheDocument();
    });

    it("should open dialog when trigger is clicked", async () => {
      const user = userEvent.setup();
      render(<AddExpenseDialog trigger={<button>Add Expense</button>} />);

      await user.click(screen.getByText("Add Expense"));

      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(
        screen.getByText("Fill in the details below to add a new expense.")
      ).toBeInTheDocument();
    });

    it("should display all form fields", async () => {
      const user = userEvent.setup();
      render(<AddExpenseDialog trigger={<button>Add Expense</button>} />);

      await user.click(screen.getByText("Add Expense"));

      expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
      expect(
        screen.getByRole("combobox", { name: /currency/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("combobox", { name: /category/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("combobox", { name: /origin account/i })
      ).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /date/i })).toBeInTheDocument();
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    });

    it("should display Save and Cancel buttons", async () => {
      const user = userEvent.setup();
      render(<AddExpenseDialog trigger={<button>Add Expense</button>} />);

      await user.click(screen.getByText("Add Expense"));

      expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /cancel/i })
      ).toBeInTheDocument();
    });
  });

  describe("Form Validation", () => {
    it("should show error when amount is negative", async () => {
      const user = userEvent.setup();
      render(<AddExpenseDialog trigger={<button>Add Expense</button>} />);

      await user.click(screen.getByText("Add Expense"));
      const amountInput = screen.getByLabelText(/amount/i);

      await user.type(amountInput, "-8");
      await user.tab();

      await waitFor(() => {
        expect(
          screen.getByText(/amount must be greater than 0/i)
        ).toBeInTheDocument();
      });
    });

    it("should show error when amount is empty", async () => {
      const user = userEvent.setup();
      render(<AddExpenseDialog trigger={<button>Add Expense</button>} />);

      await user.click(screen.getByText("Add Expense"));
      const amountInput = screen.getByLabelText(/amount/i);

      await user.click(amountInput);

      await user.tab();

      await waitFor(() => {
        expect(screen.getByText(/amount is required/i)).toBeInTheDocument();
      });
    });

    it("should accept valid positive amounts", async () => {
      const user = userEvent.setup();
      render(<AddExpenseDialog trigger={<button>Add Expense</button>} />);

      await user.click(screen.getByText("Add Expense"));
      const amountInput = screen.getByLabelText(/amount/i);

      await user.type(amountInput, "50.00");

      await waitFor(() => {
        expect(screen.queryByRole("alert")).not.toBeInTheDocument();
      });
    });

    it("should disable submit button when form is invalid", async () => {
      const user = userEvent.setup();
      render(<AddExpenseDialog trigger={<button>Add Expense</button>} />);

      await user.click(screen.getByText("Add Expense"));

      const saveButton = screen.getByRole("button", { name: /save/i });
      expect(saveButton).toBeDisabled();
    });

    it("should enable submit button when form is valid", async () => {
      const user = userEvent.setup();
      render(<AddExpenseDialog trigger={<button>Add Expense</button>} />);

      await user.click(screen.getByText("Add Expense"));
      const currencyTrigger = screen.getByRole("combobox", {
        name: /currency/i,
      });
      await user.click(currencyTrigger);
      const firstOption = within(document.body).getAllByRole("option")[0];
      await user.click(firstOption);

      const categoryTrigger = screen.getByRole("combobox", {
        name: /category/i,
      });
      await user.click(categoryTrigger);
      const firstCategoryOption = within(document.body).getAllByRole(
        "option"
      )[0];
      await user.click(firstCategoryOption);

      const accountTrigger = screen.getByRole("combobox", {
        name: /origin account/i,
      });
      await user.click(accountTrigger);
      const firstAccountOption = within(document.body).getAllByRole(
        "option"
      )[0];
      await user.click(firstAccountOption);

      const amountInput = screen.getByLabelText(/amount/i);
      await user.type(amountInput, "25.00");

      const saveButton = screen.getByRole("button", { name: /save/i });

      await waitFor(() => {
        expect(saveButton).toBeEnabled();
      });
    });

    it("should validate description max length", async () => {
      const user = userEvent.setup();
      render(<AddExpenseDialog trigger={<button>Add Expense</button>} />);

      await user.click(screen.getByText("Add Expense"));
      const descriptionInput = screen.getByLabelText(/description/i);

      const longText = "a".repeat(101);
      await user.type(descriptionInput, longText);

      // Input should be truncated to 100 characters due to maxLength
      expect(descriptionInput).toHaveValue("a".repeat(100));
    });
  });

  describe("Form Submission", () => {
    it("should submit form with valid data", async () => {
      const user = userEvent.setup();
      render(<AddExpenseDialog trigger={<button>Add Expense</button>} />);

      await user.click(screen.getByText("Add Expense"));
      const currencyTrigger = screen.getByRole("combobox", {
        name: /currency/i,
      });
      await user.click(currencyTrigger);
      const firstOption = within(document.body).getAllByRole("option")[0];
      await user.click(firstOption);

      const categoryTrigger = screen.getByRole("combobox", {
        name: /category/i,
      });
      await user.click(categoryTrigger);
      const firstCategoryOption = within(document.body).getAllByRole(
        "option"
      )[0];
      await user.click(firstCategoryOption);

      const accountTrigger = screen.getByRole("combobox", {
        name: /origin account/i,
      });
      await user.click(accountTrigger);
      const firstAccountOption = within(document.body).getAllByRole(
        "option"
      )[0];
      await user.click(firstAccountOption);

      const amountInput = screen.getByLabelText(/amount/i);
      await user.type(amountInput, "25.00");

      const saveButton = screen.getByRole("button", { name: /save/i });
      expect(saveButton).toBeEnabled();
      await waitFor(() => {
        fireEvent.submit(saveButton);
      });

      await waitFor(() => {
        expect(mockCreateExpense).toHaveBeenCalledWith(
          expect.objectContaining({
            amount: expect.any(Number),
            currency: expect.any(String),
            category: expect.any(String),
            accountId: expect.any(String),
            date: expect.any(Date),
          })
        );
      });
    });

    it("should show loading state during submission", async () => {
      mockCreateExpense.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 1000))
      );
      const user = userEvent.setup();
      render(<AddExpenseDialog trigger={<button>Add Expense</button>} />);

      await user.click(screen.getByText("Add Expense"));
      const currencyTrigger = screen.getByRole("combobox", {
        name: /currency/i,
      });
      await user.click(currencyTrigger);
      const firstOption = within(document.body).getAllByRole("option")[0];
      await user.click(firstOption);

      const categoryTrigger = screen.getByRole("combobox", {
        name: /category/i,
      });
      await user.click(categoryTrigger);
      const firstCategoryOption = within(document.body).getAllByRole(
        "option"
      )[0];
      await user.click(firstCategoryOption);

      const accountTrigger = screen.getByRole("combobox", {
        name: /origin account/i,
      });
      await user.click(accountTrigger);
      const firstAccountOption = within(document.body).getAllByRole(
        "option"
      )[0];
      await user.click(firstAccountOption);

      const amountInput = screen.getByLabelText(/amount/i);
      await user.type(amountInput, "25.00");

      const saveButton = screen.getByRole("button", { name: /save/i });
      expect(saveButton).toBeEnabled();
      await waitFor(() => {
        fireEvent.submit(saveButton);
      });

      await waitFor(() => {
        expect(mockCreateExpense).toHaveBeenCalledWith(
          expect.objectContaining({
            amount: expect.any(Number),
            currency: expect.any(String),
            category: expect.any(String),
            accountId: expect.any(String),
            date: expect.any(Date),
          })
        );
      });

      expect(saveButton).toBeDisabled();
      expect(saveButton).toHaveTextContent(/saving.../i);
    });

    it("should close dialog after successful submission", async () => {
      mockCreateExpense.mockResolvedValueOnce(undefined);

      const user = userEvent.setup();
      render(<AddExpenseDialog trigger={<button>Add Expense</button>} />);

      await user.click(screen.getByText("Add Expense"));
      const currencyTrigger = screen.getByRole("combobox", {
        name: /currency/i,
      });
      await user.click(currencyTrigger);
      const firstOption = within(document.body).getAllByRole("option")[0];
      await user.click(firstOption);

      const categoryTrigger = screen.getByRole("combobox", {
        name: /category/i,
      });
      await user.click(categoryTrigger);
      const firstCategoryOption = within(document.body).getAllByRole(
        "option"
      )[0];
      await user.click(firstCategoryOption);

      const accountTrigger = screen.getByRole("combobox", {
        name: /origin account/i,
      });
      await user.click(accountTrigger);
      const firstAccountOption = within(document.body).getAllByRole(
        "option"
      )[0];
      await user.click(firstAccountOption);

      const amountInput = screen.getByLabelText(/amount/i);
      await user.type(amountInput, "25.00");

      const saveButton = screen.getByRole("button", { name: /save/i });
      expect(saveButton).toBeEnabled();

      await waitFor(() => {
        fireEvent.submit(saveButton);
      });

      await waitFor(() => {
        expect(mockCreateExpense).toHaveBeenCalledWith(
          expect.objectContaining({
            amount: expect.any(Number),
            currency: expect.any(String),
            category: expect.any(String),
            accountId: expect.any(String),
            date: expect.any(Date),
          })
        );
      });

      await waitFor(() => {
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      });
    });

    it.skip("should handle submission errors gracefully", async () => {
      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
      mockCreateExpense.mockRejectedValueOnce(new Error("Network error"));

      const user = userEvent.setup();
      render(<AddExpenseDialog trigger={<button>Add Expense</button>} />);

      await user.click(screen.getByText("Add Expense"));
      const currencyTrigger = screen.getByRole("combobox", {
        name: /currency/i,
      });
      await user.click(currencyTrigger);
      const firstOption = within(document.body).getAllByRole("option")[0];
      await user.click(firstOption);

      const categoryTrigger = screen.getByRole("combobox", {
        name: /category/i,
      });
      await user.click(categoryTrigger);
      const firstCategoryOption = within(document.body).getAllByRole(
        "option"
      )[0];
      await user.click(firstCategoryOption);

      const accountTrigger = screen.getByRole("combobox", {
        name: /origin account/i,
      });
      await user.click(accountTrigger);
      const firstAccountOption = within(document.body).getAllByRole(
        "option"
      )[0];
      await user.click(firstAccountOption);

      const amountInput = screen.getByLabelText(/amount/i);
      await user.type(amountInput, "25.00");

      const saveButton = screen.getByRole("button", { name: /save/i });
      expect(saveButton).toBeEnabled();
      await waitFor(() => {
        fireEvent.submit(saveButton);
      });

      await waitFor(() => {
        expect(mockCreateExpense).toHaveBeenCalledWith(
          expect.objectContaining({
            amount: expect.any(Number),
            currency: expect.any(String),
            category: expect.any(String),
            accountId: expect.any(String),
            date: expect.any(Date),
          })
        );
      });
      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          "Failed to create expense:",
          expect.any(Error)
        );
      });

      consoleErrorSpy.mockRestore();
    });
  });

  describe("Dialog Interactions", () => {
    it("should close dialog when Cancel button is clicked", async () => {
      const user = userEvent.setup();
      render(<AddExpenseDialog trigger={<button>Add Expense</button>} />);

      await user.click(screen.getByText("Add Expense"));
      expect(screen.getByRole("dialog")).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: /cancel/i }));

      await waitFor(() => {
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      });
    });

    it("should reset form when dialog is closed", async () => {
      const user = userEvent.setup();
      render(<AddExpenseDialog trigger={<button>Add Expense</button>} />);

      // Open dialog and fill form
      await user.click(screen.getByText("Add Expense"));
      await user.type(screen.getByLabelText(/amount/i), "50.00");
      await user.type(screen.getByLabelText(/description/i), "Test");

      // Close dialog
      await user.click(screen.getByRole("button", { name: /cancel/i }));

      // Reopen dialog
      await user.click(screen.getByText("Add Expense"));

      // Form should be reset
      expect(screen.getByLabelText(/amount/i)).toHaveValue("");
      expect(screen.getByLabelText(/description/i)).toHaveValue("");
    });

    it("should close dialog on ESC key press", async () => {
      const user = userEvent.setup();
      render(<AddExpenseDialog trigger={<button>Add Expense</button>} />);

      await user.click(screen.getByText("Add Expense"));
      expect(screen.getByRole("dialog")).toBeInTheDocument();

      await user.keyboard("{Escape}");

      await waitFor(() => {
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      });
    });
  });

  describe("Date Selection", () => {
    it.skip("should allow selecting a date", async () => {
      const user = userEvent.setup();
      render(<AddExpenseDialog trigger={<button>Add Expense</button>} />);

      await user.click(screen.getByText("Add Expense"));
      expect(screen.getByRole("dialog")).toBeInTheDocument();

      const button = screen.getByLabelText(/pick a date/i);
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByRole("grid")).toBeInTheDocument();
      });

      const expectedDate = new Date(2025, 10, 15);

      const dayButton = screen.getByText(format(expectedDate, "PPP"));

      await user.click(dayButton);

      await waitFor(() => {
        expect(button).toHaveTextContent(format(expectedDate, "PPP"));
      });
    });

    it("should display default date", async () => {
      const user = userEvent.setup();
      render(<AddExpenseDialog trigger={<button>Add Expense</button>} />);

      await user.click(screen.getByText("Add Expense"));
      const dateButton = screen.getByRole("button", { name: /date/i });
      expect(dateButton).toBeInTheDocument();

      expect(dateButton).toHaveTextContent(format(new Date(), "PPP"));
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA labels", async () => {
      const user = userEvent.setup();
      render(<AddExpenseDialog trigger={<button>Add Expense</button>} />);

      await user.click(screen.getByText("Add Expense"));

      expect(screen.getByLabelText(/amount/i)).toHaveAttribute(
        "aria-required",
        "true"
      );
      expect(
        screen.getByRole("combobox", { name: /currency/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("combobox", { name: /category/i })
      ).toBeInTheDocument();
    });

    it.skip("should mark invalid fields with aria-invalid", async () => {
      const user = userEvent.setup();
      render(<AddExpenseDialog trigger={<button>Add Expense</button>} />);

      await user.click(screen.getByText("Add Expense"));

      const amountInput = screen.getByLabelText(/amount/i);
      await user.type(amountInput, "-8");

      await waitFor(() => {
        expect(amountInput).toHaveAttribute("aria-invalid", "true");
      });
    });

    it.skip("should associate error messages with inputs via aria-describedby", async () => {
      const user = userEvent.setup();
      render(<AddExpenseDialog trigger={<button>Add Expense</button>} />);

      await user.click(screen.getByText("Add Expense"));

      const amountInput = screen.getByLabelText(/amount/i);
      await user.type(amountInput, "-8");

      await waitFor(() => {
        const errorId = amountInput.getAttribute("aria-describedby");
        expect(errorId).toBeTruthy();
        expect(screen.getByRole("alert")).toHaveAttribute("id", errorId);
      });
    });

    it.skip("should disable all inputs during submission", async () => {
      const user = userEvent.setup();
      mockCreateExpense.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 1000))
      );

      render(<AddExpenseDialog trigger={<button>Add Expense</button>} />);

      await user.click(screen.getByText("Add Expense"));

      // Fill form
      await user.type(screen.getByLabelText(/amount/i), "50.00");
      await user.click(screen.getByRole("combobox", { name: /currency/i }));
      await user.click(screen.getByRole("option", { name: "USD" }));
      await user.click(screen.getByRole("combobox", { name: /category/i }));
      await user.click(screen.getAllByRole("option")[0]);
      await user.click(
        screen.getByRole("combobox", { name: /origin account/i })
      );
      await user.click(screen.getByRole("option", { name: "Account 1" }));

      // Submit
      await user.click(screen.getByRole("button", { name: /save/i }));

      // Check that inputs are disabled
      expect(screen.getByLabelText(/amount/i)).toBeDisabled();
      expect(screen.getByLabelText(/description/i)).toBeDisabled();
    });
  });

  describe("Select Components", () => {
    it("should render all currency options", async () => {
      const user = userEvent.setup();
      render(<AddExpenseDialog trigger={<button>Add Expense</button>} />);

      await user.click(screen.getByText("Add Expense"));
      await user.click(screen.getByRole("combobox", { name: /currency/i }));

      // Check for USD currency
      expect(screen.getByRole("option", { name: "USD" })).toBeInTheDocument();
    });

    it("should render all category options", async () => {
      const user = userEvent.setup();
      render(<AddExpenseDialog trigger={<button>Add Expense</button>} />);

      await user.click(screen.getByText("Add Expense"));
      await user.click(screen.getByRole("combobox", { name: /category/i }));

      // Categories should be rendered
      const options = within(document.body).getAllByRole("option");
      expect(options.length).toBeGreaterThan(0);
    });

    it("should render all account options", async () => {
      const user = userEvent.setup();
      render(<AddExpenseDialog trigger={<button>Add Expense</button>} />);

      await user.click(screen.getByText("Add Expense"));
      await user.click(
        screen.getByRole("combobox", { name: /origin account/i })
      );

      expect(
        within(document.body).getByRole("option", { name: "Account 1" })
      ).toBeInTheDocument();
      expect(
        within(document.body).getByRole("option", { name: "Account 2" })
      ).toBeInTheDocument();
      expect(
        within(document.body).getByRole("option", { name: "Account 3" })
      ).toBeInTheDocument();
    });
  });
});
