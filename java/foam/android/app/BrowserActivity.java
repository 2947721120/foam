package foam.android.app;

import android.app.FragmentManager;
import android.app.FragmentTransaction;
import android.os.Bundle;
import android.support.annotation.IdRes;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.ViewGroup;
import android.widget.FrameLayout;

import foam.android.core.FOAMActionBarActivity;
import foam.core.FObject;
import foam.core.PropertyChangeEvent;
import foam.core.PropertyChangeListener;
import foam.core.SimpleValue;
import foam.dao.DAO;
import foam.tutorials.todo.R;


public class BrowserActivity extends FOAMActionBarActivity implements PropertyChangeListener<FObject> {
  /**
   * Subclasses are expected to set {@link #dao} properly.
   */
  protected DAO dao;
  private SimpleValue<FObject> selection;
  private FrameLayout frame;
  @IdRes
  private final int frameId = 225;

  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    selection = new SimpleValue<>();
    selection.addListener(this);

    X(X().put("selection", selection).put("dao", dao));

    frame = new FrameLayout(this);
    frame.setId(frameId);
    setContentView(frame, new ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT,
        ViewGroup.LayoutParams.MATCH_PARENT));
    renderFragmentForSelection(null, null);
  }

  @Override
  public void propertyChange(PropertyChangeEvent<FObject> event) {
    FObject nu = event.getNewValue();
    renderFragmentForSelection(event.getOldValue(), nu);
    getSupportActionBar().setDisplayHomeAsUpEnabled(nu != null);
  }

  /**
   * Handles updating the current fragment based on the selection.
   *
   * When the value goes null->foo, we replace and push.
   * When it goes from foo->bar, we replace without pushing.
   * When it goes from foo->null, we either pop or replace, depending on whether the value already exists.
   * When it goes from null->null, we dump the stack and add the list view.
   *
   * TODO(braden): Ultimately this should be replaced with a memento-style system of navigation.
   * @param old The previous selection value.
   * @param nu The new selection value.
   */
  private void renderFragmentForSelection(FObject old, FObject nu) {
    Log.i("FragJug", "Top of render: " + old + " to " + nu);
    FragmentManager manager = getFragmentManager();
    FragmentTransaction trans = manager.beginTransaction();

    if (nu == null) { // Render the list.
      Log.i("FragJug", "list (both null)");
      ListFragment list = new ListFragment();
      list.X(X().put("data", dao));
      trans.replace(frameId, list);
      trans.setTransition(FragmentTransaction.TRANSIT_FRAGMENT_CLOSE);
      trans.commit();
    } else { // Render the details
      Log.i("FragJug", "->details");
      DetailFragment details = new DetailFragment();
      details.X(X().put("data", selection));
      trans.replace(frameId, details);
      trans.setTransition(FragmentTransaction.TRANSIT_FRAGMENT_OPEN);
      trans.commit();
    }
  }

  @Override
  public void onBackPressed() {
    FragmentManager manager = getFragmentManager();
    if (selection.get() != null) {
      selection.set(null);
    } else {
      super.onBackPressed();
    }
  }

  @Override
  public boolean onCreateOptionsMenu(Menu menu) {
    // Inflate the menu; this adds items to the action bar if it is present.
    getMenuInflater().inflate(R.menu.menu_main, menu);
    return true;
  }
  @Override
  public boolean onOptionsItemSelected(MenuItem item) {
    // Handle action bar item clicks here. The action bar will
    // automatically handle clicks on the Home/Up button, so long
    // as you specify a parent activity in AndroidManifest.xml.
    int id = item.getItemId();

    //noinspection SimplifiableIfStatement
    if (id == R.id.action_settings) {
      return true;
    }

    return super.onOptionsItemSelected(item);
  }

  @Override
  public boolean onSupportNavigateUp() {
    Log.i("FragJug", "SupportNavigate up");
    return onNavigateUp();
  }
  @Override
  public boolean onNavigateUp() {
    Log.i("FragJug", "Navigate up");
    selection.set(null);
    return true;
  }
}
