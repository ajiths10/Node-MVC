<form action="/cart" method="post">
<input type="hidden" name="productSize" value="<%= product.size %>">
<button class="btn" type="submit">Add to Cart</button>
<input type="hidden" name="productId" value="<%= product.id %>">
</form>